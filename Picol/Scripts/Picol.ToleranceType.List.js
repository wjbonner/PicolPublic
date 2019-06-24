$.ToleranceTypeHelper = {
    QueueAndExecuteCommand: function (item, column, editCommand) {
        if (column['id'] == 'Code') {
            $.ToleranceType.Update(item.id, editCommand.serializedValue, item.Description, editCommand);
        } else if (column['id'] == 'Description') {
            $.ToleranceType.Update(item.id, item.Code, editCommand.serializedValue, editCommand);
        } else {
            editCommand.execute();
            $('#OverlayDisplay').hide();
        }
    },

    ActionsFormatter: function (row, cell, value, columnDef, dataContext) {
        var details = "<a href='/ToleranceType/Details/" + dataContext["id"] + "'>Details</a>";
        var del = "<a href='javascript:void(0)' onclick='$.ToleranceType.Delete(" + dataContext["id"] + ")'>Delete</a>";
        return details + " | " + del;
    }
}

$.ToleranceType = {
    CookieName: "Picol.ToleranceType.List.Grid",
    GridContainer: 'ToleranceTypeGrid',
    CounterName: 'ToleranceTypeCounter',
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
        { id: "Code", name: "Code", field: "Code", sortable: true, editor: Slick.Editors.Text },
        { id: "Description", name: "Description", field: "Description", sortable: true, editor: Slick.Editors.Text },
        { id: "Actions", name: "Actions", field: "Actions", sortable: true, formatter: $.ToleranceTypeHelper.ActionsFormatter }
    ],

    GridOptions: {
        enableCellNavigation: true,
        editable: true,
        forceFitColumns: true,
        editCommandHandler: $.ToleranceTypeHelper.QueueAndExecuteCommand,
        autoEdit: true,
        showHeaderRow: true,
        headerRowHeight: 40,
        explicitInitialization: true,
        multiColumnSort: true,
        enableTextSelectionOnCells: true
    },

    Driver: function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Retrieving ToleranceTypes');
        $.ToleranceType.ResizeGridContainer();

        $.ToleranceType.Clean()
            .done($.ToleranceType.Instantiate)
            .done($.ToleranceType.GetToleranceTypes)
            .done($.ToleranceType.BuildMenu)
            .done($.ToleranceType.ConfigureColumns)
            .done($.ToleranceType.InitializeGrid)
            .done($.ToleranceType.InitializeGridPlugins)
            .done($.ToleranceType.WireGridEvents)
            .done($.ToleranceType.ConfigureFilters);
    },

    Clean: function () {
        // create a deferred object
        var def = $.Deferred();

        if ($.ToleranceType.Grid) {
            $('#' + $.ToleranceType.CounterName).text('');
            $('#' + $.ToleranceType.CounterName).empty();
            $('#' + $.ToleranceType.CounterName + ' input').val('');

            var members = [];
            $.each($.ToleranceType.ColumnFilters, function (index, item) {
                item = '';
                members.push(index);
            });

            $.each(members, function (index, item) {
                $.ToleranceType.ColumnFilters[item] = '';
            });

            $.ToleranceType.Grid.invalidateAllRows();
            $('#' + $.ToleranceType.GridContainer).empty();
        }

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    Instantiate: function () {
        // create a deferred object
        var def = $.Deferred();

        $.ToleranceType.Data = [];
        $.ToleranceType.ColumnFilters = {};
        $.ToleranceType.DataView = new Slick.Data.DataView({
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
        for (var i = 0; i < $.ToleranceType.Columns.length; i++) {
            switch ($.ToleranceType.Columns[i]["id"]) {
                case 'Name':
                    $.ToleranceType.Columns[i].header = {
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

    GetToleranceTypes: function () {
        // create a deferred object
        var def = $.Deferred();

        // We get our data from the server
        $.ajax({
            type: 'GET',
            url: '/ToleranceType/Get',
            data: {},
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    if (response.ToleranceTypes.length == 0) {
                        // No data in report
                    } else {
                        for (var i = 0; i < response.ToleranceTypes.length; i++) {
                            $.ToleranceType.Data[i] = {
                                "id": response.ToleranceTypes[i]["Id"],
                                "Name": response.ToleranceTypes[i]["Name"],
                                "Code": response.ToleranceTypes[i]["Code"],
                                "Description": response.ToleranceTypes[i]["Description"],
                                "Actions": ""
                            };
                        }

                        $.ToleranceType.DataView.setItems($.ToleranceType.Data);

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
        var cookieCols = $.GUM.GetFromCookie($.ToleranceType.CookieName);

        // We set the display columns to the manually defined columns
        $.ToleranceType.DisplayColumns = $.ToleranceType.Columns;

        if (cookieCols != null) {
            // Since the cookie exists we set the display columns to the JSON encoded column array in the cookie
            $.ToleranceType.DisplayColumns = JSON.parse(cookieCols);

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
                for (k = 0; k < $.ToleranceType.DisplayColumns.length; k++) {
                    if ($.ToleranceType.DisplayColumns[k].id == columnData[i].Id) {
                        $.ToleranceType.DisplayColumns[k][columnData[i].Action] = columnData[i].Data;
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
        //$.ToleranceType.ColumnFilters = { Active: "true" };

        // We check the column filters and re-apply them and set the filter values into the text boxes
        $.each($.ToleranceType.ColumnFilters, function (key, value) {
            $("[data-filterId='" + key + "']").val(value);
        })

        // Set the active filter and grid references
        $.CSF.globalColumnFilters = $.ToleranceType.ColumnFilters;
        $.CSF.globalGridReference = $.ToleranceType.Grid;
        $.ToleranceType.DataView.refresh();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    InitializeGrid: function () {
        // create a deferred object
        var def = $.Deferred();

        $.ToleranceType.Grid = new Slick.Grid("#" + $.ToleranceType.GridContainer, $.ToleranceType.DataView, $.ToleranceType.DisplayColumns, $.ToleranceType.GridOptions);

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
                    $.GUM.SaveToCookie($.ToleranceType.CookieName, JSON.stringify($.ToleranceType.Grid.getColumns()));
                    break;
                case 'Clear':
                    $.GUM.ClearFromCookie($.ToleranceType.CookieName);
                    break;
                case 'Export':
                    $.GUM.ExportSlickGrid($.ToleranceType.Grid, $.ToleranceType.DataView);
                    break;
                default:
                    alert('Invalid menu command!');
            }
        });

        // register the header menu plugin
        $.ToleranceType.Grid.registerPlugin(headerMenuPlugin);

        // Note that the columns are the manually defined columns, which is necessary for the column picker to have all columns in it, not just the ones saved in the cookie
        var activityColumnpicker = new Slick.Controls.ColumnPicker($.ToleranceType.Columns, $.ToleranceType.Grid, $.ToleranceType.GridOptions);

        // register the group item metadata provider to add expand/collapse group handlers
        $.ToleranceType.Grid.registerPlugin($.ToleranceType.GroupItemMetadataProvider);

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    WireGridEvents: function () {
        // create a deferred object
        var def = $.Deferred();

        // Our scroll event
        $.ToleranceType.Grid.onScroll.subscribe(function (e, args) {
            // Actions here
        });

        // Our sort function
        $.ToleranceType.Grid.onSort.subscribe(function (e, args) {
            $.CSC.globalSortColumns = args.sortCols;
            $.ToleranceType.DataView.sort($.CSC.globalMultiColumnComparer, args.sortAsc);
        });

        // Row count change event
        $.ToleranceType.DataView.onRowCountChanged.subscribe(function (e, args) {
            $.ToleranceType.Grid.updateRowCount();
            $.ToleranceType.Grid.render();
            $.ToleranceType.UpdateRecordCount();
        });

        // Row chnge event
        $.ToleranceType.DataView.onRowsChanged.subscribe(function (e, args) {
            $.ToleranceType.Grid.invalidateRows(args.rows);
            $.ToleranceType.Grid.render();
        });

        // Delegate handler for the filters in the header row
        $($.ToleranceType.Grid.getHeaderRow()).delegate(":input", "change keyup", function (e) {
            var columnId = $(this).data("columnId");
            if (columnId != null) {
                // We create a local copy of the filters and then assign the value to the global filters
                $.ToleranceType.ColumnFilters[columnId] = $.trim($(this).val());
                $.CSF.globalColumnFilters = $.ToleranceType.ColumnFilters;

                // We assign our grid to the global grid reference for the global search filter to use and then refresh the grid.  This allows multiple grids to use the same search filter
                $.CSF.globalGridReference = $.ToleranceType.Grid;
                $.ToleranceType.DataView.refresh();
                $.ToleranceType.UpdateRecordCount();
            }
        });

        $.ToleranceType.Grid.onHeaderRowCellRendered.subscribe(function (e, args) {
            $(args.node).empty();
            $("<input type='text'>")
               .data("columnId", args.column.id)
               .val($.CSF.globalColumnFilters[args.column.id])
                .attr("data-filterId", args.column.id)
               .appendTo(args.node);
        });

        $.ToleranceType.DataView.setFilter($.CSF.globalFilter);
        $.ToleranceType.Grid.init();

        $.ToleranceType.UpdateRecordCount();
        $.ToleranceType.ResizeGrid();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    UpdateRecordCount: function () {
        var negativeRows = $.ToleranceType.DataView.getGroups().length * 2;
        $('#' + $.ToleranceType.CounterName).text('| ' + Number($.ToleranceType.DataView.getLength() - negativeRows) + ' Records');
    },

    ResizeGrid: function () {
        this.ResizeGridContainer();

        if ($.ToleranceType.Grid) {
            $.ToleranceType.Grid.resizeCanvas();
        }
    },

    ResizeGridContainer: function () {
        $('#' + $.ToleranceType.GridContainer).height($(window).height() - 35);
    },

    Create: function () {
        $.ajax({
            type: 'POST',
            url: '/ToleranceType/Create',
            data: { code: $('#Code').val(), description: $("#Description").val() },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    $.ToleranceType.DataView.addItem({
                        id: response.ToleranceType.Id,
                        Code: response.ToleranceType.Code,
                        Description: response.ToleranceType.Description,
                    });

                    $('#Code').val("");
                    $('#Description').val("");
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

    Update: function (id, code, description, editCommand) {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Updating');

        $.ajax({
            type: 'POST',
            url: '/ToleranceType/Update',
            data: { id: id, code: code, description: description },
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
        if (!confirm('Are you sure you want to permenantly and irrevocably delete this tolerance type and all associated records?')) {
            return;
        }

        $.ajax({
            type: 'POST',
            url: '/ToleranceType/Delete',
            data: { id: id },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    $.ToleranceType.DataView.deleteItem(id);
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
    $.ToleranceType.ResizeGrid();
});

$(window).load(function () {
    $.ToleranceType.ResizeGridContainer();
    $.ToleranceType.Driver();

    $('#ExportToleranceTypeGrid').click(function () {
        $.GUM.ExportSlickGrid($.ToleranceType.Grid, $.ToleranceType.DataView);
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
        $.ToleranceType.Create();
    });
});