$.ResistanceHelper = {
    QueueAndExecuteCommand: function (item, column, editCommand) {
        if (column['id'] == 'Source') {
            $.Resistance.Update(item.id, editCommand.serializedValue, item.Code, item.MethodOfAction, editCommand);
        } else if (column['id'] == 'Code') {
            $.Resistance.Update(item.id, item.Name, editCommand.serializedValue, item.MethodOfAction, editCommand);
        } else if (column['id'] == 'MethodOfAction') {
            $.Resistance.Update(item.id, item.Name, item.Code, editCommand.serializedValue, editCommand);
        } else {
            editCommand.execute();
            $('#OverlayDisplay').hide();
        }
    },

    ActionsFormatter: function (row, cell, value, columnDef, dataContext) {
        var details = "<a href='/Resistance/Details/" + dataContext["id"] + "'>Details</a>";
        var del = "<a href='javascript:void(0)' onclick='$.Resistance.Delete(" + dataContext["id"] + ")'>Delete</a>";
        return details + " | " + del;
    }
}

$.Resistance = {
    CookieName: "Picol.Resistance.List.Grid",
    GridContainer: 'ResistanceGrid',
    CounterName: 'ResistanceCounter',
    Grid: null,
    GroupItemMetadataProvider: new Slick.Data.GroupItemMetadataProvider(),
    DataView: new Slick.Data.DataView({
        groupItemMetadataProvider: $(this).GroupItemMetadataProvider,
        inlineFilters: true
    }),
    Data: [],
    ColumnFilters: {},
    DisplayColumns: [],
    Columns: [
        { id: "Source", name: "Source", field: "Source", sortable: true, editor: Slick.Editors.Text },
        { id: "Code", name: "Code", field: "Code", sortable: true, editor: Slick.Editors.Text },
        { id: "MethodOfAction", name: "MethodOfAction", field: "MethodOfAction", sortable: true, editor: Slick.Editors.Text },
        { id: "Actions", name: "Actions", field: "Actions", sortable: true, formatter: $.ResistanceHelper.ActionsFormatter }
    ],

    GridOptions: {
        enableCellNavigation: true,
        editable: true,
        forceFitColumns: true,
        editCommandHandler: $.ResistanceHelper.QueueAndExecuteCommand,
        autoEdit: true,
        showHeaderRow: true,
        headerRowHeight: 40,
        explicitInitialization: true,
        multiColumnSort: true,
        enableTextSelectionOnCells: true
    },

    Driver: function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Retrieving Resistances');
        $.Resistance.ResizeGridContainer();

        $.Resistance.Clean()
            .done($.Resistance.Instantiate)
            .done($.Resistance.GetResistances)
            .done($.Resistance.BuildMenu)
            .done($.Resistance.ConfigureColumns)
            .done($.Resistance.InitializeGrid)
            .done($.Resistance.InitializeGridPlugins)
            .done($.Resistance.WireGridEvents)
            .done($.Resistance.ConfigureFilters);
    },

    Clean: function () {
        // create a deferred object
        var def = $.Deferred();

        if ($.Resistance.Grid) {
            $('#' + $.Resistance.CounterName).text('');
            $('#' + $.Resistance.CounterName).empty();
            $('#' + $.Resistance.CounterName + ' input').val('');

            var members = [];
            $.each($.Resistance.ColumnFilters, function (index, item) {
                item = '';
                members.push(index);
            });

            $.each(members, function (index, item) {
                $.Resistance.ColumnFilters[item] = '';
            });

            $.Resistance.Grid.invalidateAllRows();
            $('#' + $.Resistance.GridContainer).empty();
        }

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    Instantiate: function () {
        // create a deferred object
        var def = $.Deferred();

        $.Resistance.Data = [];
        $.Resistance.ColumnFilters = {};
        $.Resistance.DataView = new Slick.Data.DataView({
            groupItemMetadataProvider: $(this).GroupItemMetadataProvider,
            inlineFilters: true
        });

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    BuildMenu: function () {
        // create a deferred object
        var def = $.Deferred();

        // We define our column menu structure
        for (var i = 0; i < $.Resistance.Columns.length; i++) {
            switch ($.Resistance.Columns[i]["id"]) {
                case 'Name':
                    $.Resistance.Columns[i].header = {
                        menu: {
                            items: [
                                {
                                    title: "Save",
                                    command: "Save"
                                },
                                {
                                    title: "Clear",
                                    command: "Clear"
                                },
                                {
                                    title: "Export",
                                    command: "Export"
                                }
                            ]
                        }
                    };
                    break;
                default:
            }
        }

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    GetResistances: function () {
        // create a deferred object
        var def = $.Deferred();

        // We get our data from the server
        $.ajax({
            type: 'GET',
            url: '/Resistance/Get',
            data: {},
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    if (response.Resistances.length == 0) {
                        // No data in report
                    } else {
                        for (var i = 0; i < response.Resistances.length; i++) {
                            $.Resistance.Data[i] = {
                                "id": response.Resistances[i]["Id"],
                                "Source": response.Resistances[i]["Source"],
                                "Code": response.Resistances[i]["Code"],
                                "MethodOfAction": response.Resistances[i]["MethodOfAction"],
                                "Actions": ""
                            };
                        }

                        $.Resistance.DataView.setItems($.Resistance.Data);

                        // Call resolve on the deferred object
                        def.resolve();
                    }
                }
            },
            error: function (response) {
                alert('An error has occurred communicating with the server!');
            },
            complete: function (response) {
                $('#OverlayDisplay').hide();
            }
        });

        // Return the deferred object
        return def;
    },

    ConfigureColumns: function () {
        // create a deferred object
        var def = $.Deferred();

        // grab the cookie that tracks the column settings like column width, order, etc...
        var cookieCols = $.GUM.GetFromCookie($.Resistance.CookieName);

        // We set the display columns to the manually defined columns
        $.Resistance.DisplayColumns = $.Resistance.Columns;

        if (cookieCols != null) {
            // Since the cookie exists we set the display columns to the JSON encoded column array in the cookie
            $.Resistance.DisplayColumns = JSON.parse(cookieCols);

            var columnData = [];
            var i = 0, k = 0;

            // We need to associate the above defined formatter function handlers to the columns from the cookie, so we start by build an array of the objects from the columns above
            for (var i = 0; i < columns.length; i++) {
                if (columns[i].formatter) {
                    columnData.push({ Id: columns[i].id, Action: "formatter", Data: columns[i].formatter });
                }

                if (columns[i].editor) {
                    columnData.push({ Id: columns[i].id, Action: "editor", Data: columns[i].editor });
                }

                if (columns[i].groupTotalsFormatter) {
                    columnData.push({ Id: columns[i].id, Action: "groupTotalsFormatter", Data: columns[i].groupTotalsFormatter });
                }
            }

            // We now iterate through the action objects and associate them with the columns from the cookies
            for (i = 0; i < columnData.length; i++) {
                for (k = 0; k < $.Resistance.DisplayColumns.length; k++) {
                    if ($.Resistance.DisplayColumns[k].id == columnData[i].Id) {
                        $.Resistance.DisplayColumns[k][columnData[i].Action] = columnData[i].Data;
                    }
                }
            }
        }

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    ConfigureFilters: function () {
        // create a deferred object
        var def = $.Deferred();

        // Set filters
        //$.Resistance.ColumnFilters = { Active: "true" };

        // We check the column filters and re-apply them and set the filter values into the text boxes
        $.each($.Resistance.ColumnFilters, function (key, value) {
            $("[data-filterId='" + key + "']").val(value);
        })

        // Set the active filter and grid references
        $.CSF.globalColumnFilters = $.Resistance.ColumnFilters;
        $.CSF.globalGridReference = $.Resistance.Grid;
        $.Resistance.DataView.refresh();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    InitializeGrid: function () {
        // create a deferred object
        var def = $.Deferred();

        $.Resistance.Grid = new Slick.Grid("#" + $.Resistance.GridContainer, $.Resistance.DataView, $.Resistance.DisplayColumns, $.Resistance.GridOptions);

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    InitializeGridPlugins: function () {
        // create a deferred object
        var def = $.Deferred();

        // Create our header menu and column picker objects
        var headerMenuPlugin = new Slick.Plugins.HeaderMenu({});

        // This is the handler for the different header menu commands
        headerMenuPlugin.onCommand.subscribe(function (e, args) {
            switch (args.command) {
                case 'Save':
                    $.GUM.SaveToCookie($.Resistance.CookieName, JSON.stringify($.Resistance.Grid.getColumns()));
                    break;
                case 'Clear':
                    $.GUM.ClearFromCookie($.Resistance.CookieName);
                    break;
                case 'Export':
                    $.GUM.ExportSlickGrid($.Resistance.Grid, $.Resistance.DataView);
                    break;
                default:
                    alert('Invalid menu command!');
            }
        });

        // register the header menu plugin
        $.Resistance.Grid.registerPlugin(headerMenuPlugin);

        // Note that the columns are the manually defined columns, which is necessary for the column picker to have all columns in it, not just the ones saved in the cookie
        var activityColumnpicker = new Slick.Controls.ColumnPicker($.Resistance.Columns, $.Resistance.Grid, $.Resistance.GridOptions);

        // register the group item metadata provider to add expand/collapse group handlers
        $.Resistance.Grid.registerPlugin($.Resistance.GroupItemMetadataProvider);

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    WireGridEvents: function () {
        // create a deferred object
        var def = $.Deferred();

        // Our scroll event
        $.Resistance.Grid.onScroll.subscribe(function (e, args) {
            // Actions here
        });

        // Our sort function
        $.Resistance.Grid.onSort.subscribe(function (e, args) {
            $.CSC.globalSortColumns = args.sortCols;
            $.Resistance.DataView.sort($.CSC.globalMultiColumnComparer, args.sortAsc);
        });

        // Row count change event
        $.Resistance.DataView.onRowCountChanged.subscribe(function (e, args) {
            $.Resistance.Grid.updateRowCount();
            $.Resistance.Grid.render();
            $.Resistance.UpdateRecordCount();
        });

        // Row chnge event
        $.Resistance.DataView.onRowsChanged.subscribe(function (e, args) {
            $.Resistance.Grid.invalidateRows(args.rows);
            $.Resistance.Grid.render();
        });

        // Delegate handler for the filters in the header row
        $($.Resistance.Grid.getHeaderRow()).delegate(":input", "change keyup", function (e) {
            var columnId = $(this).data("columnId");
            if (columnId != null) {
                // We create a local copy of the filters and then assign the value to the global filters
                $.Resistance.ColumnFilters[columnId] = $.trim($(this).val());
                $.CSF.globalColumnFilters = $.Resistance.ColumnFilters;

                // We assign our grid to the global grid reference for the global search filter to use and then refresh the grid.  This allows multiple grids to use the same search filter
                $.CSF.globalGridReference = $.Resistance.Grid;
                $.Resistance.DataView.refresh();
                $.Resistance.UpdateRecordCount();
            }
        });

        $.Resistance.Grid.onHeaderRowCellRendered.subscribe(function (e, args) {
            $(args.node).empty();
            $("<input type='text'>")
               .data("columnId", args.column.id)
               .val($.CSF.globalColumnFilters[args.column.id])
                .attr("data-filterId", args.column.id)
               .appendTo(args.node);
        });

        $.Resistance.DataView.setFilter($.CSF.globalFilter);
        $.Resistance.Grid.init();

        $.Resistance.UpdateRecordCount();
        $.Resistance.ResizeGrid();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    UpdateRecordCount: function () {
        var negativeRows = $.Resistance.DataView.getGroups().length * 2;
        $('#' + $.Resistance.CounterName).text('| ' + Number($.Resistance.DataView.getLength() - negativeRows) + ' Records');
    },

    ResizeGrid: function () {
        this.ResizeGridContainer();

        if ($.Resistance.Grid) {
            $.Resistance.Grid.resizeCanvas();
        }
    },

    ResizeGridContainer: function () {
        $('#' + $.Resistance.GridContainer).height($(window).height() - 35);
    },

    Create: function () {
        $.ajax({
            type: 'POST',
            url: '/Resistance/Create',
            data: { code: $('#Code').val(), source: $('#Source').val(), methodOfAction: $('#MethodOfAction').val() },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    $.Resistance.DataView.addItem({
                        id: response.Resistance.Id,
                        Source: response.Resistance.Source,
                        Code: response.Resistance.Code,
                        MethodOfAction: response.Resistance.MethodOfAction,
                    });

                    $('#Code').val("");
                    $('#Name').val("");
                    $('#MethodOfAction').val("");
                }
            },
            error: function (response) {
                alert('An error has occurred communicating with the server!');
            },
            complete: function (response) {
                $("#confirmationDisplay").fadeOut('slow');
            }
        });
    },

    Update: function (id, source, code, methodOfAction, editCommand) {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Updating');

        $.ajax({
            type: 'POST',
            url: '/Resistance/Update',
            data: { id: id, source: source, code: code, methodOfAction: methodOfAction },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    editCommand.execute();
                    $('#OverlayDisplay').hide();
                }
            },
            error: function (response) {
                alert('An error has occurred communicating with the server!');
            },
            complete: function (response) {
                $("#confirmationDisplay").fadeOut('slow');
            }
        });
    },

    Delete: function (id) {
        if (!confirm('Are you sure you want to permenantly and irrevocably delete this resistance and all associated records?')) {
            return;
        }

        $.ajax({
            type: 'POST',
            url: '/Resistance/Delete',
            data: { id: id },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    $.Resistance.DataView.deleteItem(id);
                }
            },
            error: function (response) {
                alert('An error has occurred communicating with the server!');
            },
            complete: function (response) {
                $("#confirmationDisplay").fadeOut('slow');
            }
        });
    }
}

function DisplayDetails(id) {
    $('#Overlay').show();
    $('#Details').show();
}

$(window).resize(function () {
    $.Resistance.ResizeGrid();
});

$(window).load(function () {
    $.Resistance.ResizeGridContainer();
    $.Resistance.Driver();

    $('#ExportResistanceGrid').click(function () {
        $.GUM.ExportSlickGrid($.Resistance.Grid, $.Resistance.DataView);
    });

    $('#OpenCreateWindow').click(function () {
        $('#CreateWindow').show();
        $('#Overlay').show();
    });

    $('#Overlay').click(function () {
        $('#CreateWindow').hide();
        $('#Overlay').hide();
    });

    $('#Create').click(function () {
        $('#CreateWindow').hide();
        $('#Overlay').hide();
        $.Resistance.Create();
    });
});