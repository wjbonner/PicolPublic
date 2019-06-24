$.UsageHelper = {
    QueueAndExecuteCommand: function (item, column, editCommand) {
        if (column['id'] == 'Name') {
            $.Usage.Update(item.id, editCommand.serializedValue, item.Code, editCommand);
        } else if (column['id'] == 'Code') {
            $.Usage.Update(item.id, item.Name, editCommand.serializedValue, editCommand);
        } else {
            editCommand.execute();
            $('#OverlayDisplay').hide();
        }
    },

    ActionsFormatter: function (row, cell, value, columnDef, dataContext) {
        var details = "<a href='/Usage/Details/" + dataContext["id"] + "'>Details</a>";
        var del = "<a href='javascript:void(0)' onclick='$.Usage.Delete(" + dataContext["id"] + ")'>Delete</a>";
        return details + " | " + del;
    }
}

$.Usage = {
    CookieName: "Picol.Usage.List.Grid",
    GridContainer: 'UsageGrid',
    CounterName: 'UsageCounter',
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
        { id: "Name", name: "Name", field: "Name", sortable: true, editor: Slick.Editors.Text },
        { id: "Code", name: "Code", field: "Code", sortable: true, editor: Slick.Editors.Text },
        { id: "Actions", name: "Actions", field: "Actions", sortable: true, formatter: $.UsageHelper.ActionsFormatter }
    ],

    GridOptions: {
        enableCellNavigation: true,
        editable: true,
        forceFitColumns: true,
        editCommandHandler: $.UsageHelper.QueueAndExecuteCommand,
        autoEdit: true,
        showHeaderRow: true,
        headerRowHeight: 40,
        explicitInitialization: true,
        multiColumnSort: true,
        enableTextSelectionOnCells: true
    },

    Driver: function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Retrieving Usages');
        $.Usage.ResizeGridContainer();

        $.Usage.Clean()
            .done($.Usage.Instantiate)
            .done($.Usage.GetUsages)
            .done($.Usage.BuildMenu)
            .done($.Usage.ConfigureColumns)
            .done($.Usage.InitializeGrid)
            .done($.Usage.InitializeGridPlugins)
            .done($.Usage.WireGridEvents)
            .done($.Usage.ConfigureFilters);
    },

    Clean: function () {
        // create a deferred object
        var def = $.Deferred();

        if ($.Usage.Grid) {
            $('#' + $.Usage.CounterName).text('');
            $('#' + $.Usage.CounterName).empty();
            $('#' + $.Usage.CounterName + ' input').val('');

            var members = [];
            $.each($.Usage.ColumnFilters, function (index, item) {
                item = '';
                members.push(index);
            });

            $.each(members, function (index, item) {
                $.Usage.ColumnFilters[item] = '';
            });

            $.Usage.Grid.invalidateAllRows();
            $('#' + $.Usage.GridContainer).empty();
        }

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    Instantiate: function () {
        // create a deferred object
        var def = $.Deferred();

        $.Usage.Data = [];
        $.Usage.ColumnFilters = {};
        $.Usage.DataView = new Slick.Data.DataView({
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
        for (var i = 0; i < $.Usage.Columns.length; i++) {
            switch ($.Usage.Columns[i]["id"]) {
                case 'Name':
                    $.Usage.Columns[i].header = {
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

    GetUsages: function () {
        // create a deferred object
        var def = $.Deferred();

        // We get our data from the server
        $.ajax({
            type: 'GET',
            url: '/Usage/Get',
            data: {},
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    if (response.Usages.length == 0) {
                        // No data in report
                    } else {
                        for (var i = 0; i < response.Usages.length; i++) {
                            $.Usage.Data[i] = {
                                "id": response.Usages[i]["Id"],
                                "Name": response.Usages[i]["Name"],
                                "Code": response.Usages[i]["Code"],
                                "Actions": ""
                            };
                        }

                        $.Usage.DataView.setItems($.Usage.Data);

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
        var cookieCols = $.GUM.GetFromCookie($.Usage.CookieName);

        // We set the display columns to the manually defined columns
        $.Usage.DisplayColumns = $.Usage.Columns;

        if (cookieCols != null) {
            // Since the cookie exists we set the display columns to the JSON encoded column array in the cookie
            $.Usage.DisplayColumns = JSON.parse(cookieCols);

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
                for (k = 0; k < $.Usage.DisplayColumns.length; k++) {
                    if ($.Usage.DisplayColumns[k].id == columnData[i].Id) {
                        $.Usage.DisplayColumns[k][columnData[i].Action] = columnData[i].Data;
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
        //$.Usage.ColumnFilters = { Active: "true" };

        // We check the column filters and re-apply them and set the filter values into the text boxes
        $.each($.Usage.ColumnFilters, function (key, value) {
            $("[data-filterId='" + key + "']").val(value);
        })

        // Set the active filter and grid references
        $.CSF.globalColumnFilters = $.Usage.ColumnFilters;
        $.CSF.globalGridReference = $.Usage.Grid;
        $.Usage.DataView.refresh();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    InitializeGrid: function () {
        // create a deferred object
        var def = $.Deferred();

        $.Usage.Grid = new Slick.Grid("#" + $.Usage.GridContainer, $.Usage.DataView, $.Usage.DisplayColumns, $.Usage.GridOptions);

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
                    $.GUM.SaveToCookie($.Usage.CookieName, JSON.stringify($.Usage.Grid.getColumns()));
                    break;
                case 'Clear':
                    $.GUM.ClearFromCookie($.Usage.CookieName);
                    break;
                case 'Export':
                    $.GUM.ExportSlickGrid($.Usage.Grid, $.Usage.DataView);
                    break;
                default:
                    alert('Invalid menu command!');
            }
        });

        // register the header menu plugin
        $.Usage.Grid.registerPlugin(headerMenuPlugin);

        // Note that the columns are the manually defined columns, which is necessary for the column picker to have all columns in it, not just the ones saved in the cookie
        var activityColumnpicker = new Slick.Controls.ColumnPicker($.Usage.Columns, $.Usage.Grid, $.Usage.GridOptions);

        // register the group item metadata provider to add expand/collapse group handlers
        $.Usage.Grid.registerPlugin($.Usage.GroupItemMetadataProvider);

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    WireGridEvents: function () {
        // create a deferred object
        var def = $.Deferred();

        // Our scroll event
        $.Usage.Grid.onScroll.subscribe(function (e, args) {
            // Actions here
        });

        // Our sort function
        $.Usage.Grid.onSort.subscribe(function (e, args) {
            $.CSC.globalSortColumns = args.sortCols;
            $.Usage.DataView.sort($.CSC.globalMultiColumnComparer, args.sortAsc);
        });

        // Row count change event
        $.Usage.DataView.onRowCountChanged.subscribe(function (e, args) {
            $.Usage.Grid.updateRowCount();
            $.Usage.Grid.render();
            $.Usage.UpdateRecordCount();
        });

        // Row chnge event
        $.Usage.DataView.onRowsChanged.subscribe(function (e, args) {
            $.Usage.Grid.invalidateRows(args.rows);
            $.Usage.Grid.render();
        });

        // Delegate handler for the filters in the header row
        $($.Usage.Grid.getHeaderRow()).delegate(":input", "change keyup", function (e) {
            var columnId = $(this).data("columnId");
            if (columnId != null) {
                // We create a local copy of the filters and then assign the value to the global filters
                $.Usage.ColumnFilters[columnId] = $.trim($(this).val());
                $.CSF.globalColumnFilters = $.Usage.ColumnFilters;

                // We assign our grid to the global grid reference for the global search filter to use and then refresh the grid.  This allows multiple grids to use the same search filter
                $.CSF.globalGridReference = $.Usage.Grid;
                $.Usage.DataView.refresh();
                $.Usage.UpdateRecordCount();
            }
        });

        $.Usage.Grid.onHeaderRowCellRendered.subscribe(function (e, args) {
            $(args.node).empty();
            $("<input type='text'>")
               .data("columnId", args.column.id)
               .val($.CSF.globalColumnFilters[args.column.id])
                .attr("data-filterId", args.column.id)
               .appendTo(args.node);
        });

        $.Usage.DataView.setFilter($.CSF.globalFilter);
        $.Usage.Grid.init();

        $.Usage.UpdateRecordCount();
        $.Usage.ResizeGrid();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    UpdateRecordCount: function () {
        var negativeRows = $.Usage.DataView.getGroups().length * 2;
        $('#' + $.Usage.CounterName).text('| ' + Number($.Usage.DataView.getLength() - negativeRows) + ' Records');
    },

    ResizeGrid: function () {
        this.ResizeGridContainer();

        if ($.Usage.Grid) {
            $.Usage.Grid.resizeCanvas();
        }
    },

    ResizeGridContainer: function () {
        $('#' + $.Usage.GridContainer).height($(window).height() - 35);
    },

    Create: function () {
        $.ajax({
            type: 'POST',
            url: '/Usage/Create',
            data: { code: $('#Code').val(), name: $('#Name').val() },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    $.Usage.DataView.addItem({
                        id: response.Usage.Id,
                        Name: response.Usage.Name,
                        Code: response.Usage.Code,
                        Notes: response.Usage.Notes,
                    });

                    $('#Code').val("");
                    $('#Name').val("");
                    $('#Notes').val("");
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

    Update: function (id, name, code, editCommand) {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Updating');

        $.ajax({
            type: 'POST',
            url: '/Usage/Update',
            data: { id: id, name: name, code: code},
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
        if (!confirm('Are you sure you want to permenantly and irrevocably delete this usage and all associated records?')) {
            return;
        }

        $.ajax({
            type: 'POST',
            url: '/Usage/Delete',
            data: { id: id },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    $.Usage.DataView.deleteItem(id);
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
    $.Usage.ResizeGrid();
});

$(window).load(function () {
    $.Usage.ResizeGridContainer();
    $.Usage.Driver();

    $('#ExportUsageGrid').click(function () {
        $.GUM.ExportSlickGrid($.Usage.Grid, $.Usage.DataView);
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
        $.Usage.Create();
    });
});