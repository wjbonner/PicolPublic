$.PesticideTypeHelper = {
    QueueAndExecuteCommand: function (item, column, editCommand) {
        if (column['id'] == 'Name') {
        } else {
            editCommand.execute();
        }
    },

    ActionsFormatter: function (row, cell, value, columnDef, dataContext) {
        return "<a href='javascript:void(0)' onclick='DisplayDetails(" + dataContext["id"] + ")'>Details</a>";
    }
}

$.PesticideType = {
    CookieName: "Picol.Search.Index.PesticideTypeGrid",
    GridContainer: 'PesticideTypeGrid',
    CounterName: 'PesticideTypeCounter',
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
        { id: "Name", name: "Name", field: "Name", sortable: true },
        { id: "Code", name: "Code", field: "Code", sortable: true }
    ],

    GridOptions: {
        enableCellNavigation: true,
        editable: true,
        forceFitColumns: true,
        editCommandHandler: $.PesticideTypeHelper.QueueAndExecuteCommand,
        autoEdit: true,
        showHeaderRow: true,
        headerRowHeight: 40,
        explicitInitialization: true,
        multiColumnSort: true,
        enableTextSelectionOnCells: true
    },

    Driver: function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Retrieving PesticideTypes');
        $.PesticideType.ResizeGridContainer();

        $.PesticideType.Clean()
            .done($.PesticideType.Instantiate)
            .done($.PesticideType.GetPesticideTypes)
            .done($.PesticideType.BuildMenu)
            .done($.PesticideType.ConfigureColumns)
            .done($.PesticideType.InitializeGrid)
            .done($.PesticideType.InitializeGridPlugins)
            .done($.PesticideType.WireGridEvents)
            .done($.PesticideType.ConfigureFilters);
    },

    Clean: function () {
        // create a deferred object
        var def = $.Deferred();

        if ($.PesticideType.Grid) {
            $('#' + $.PesticideType.CounterName).text('');
            $('#' + $.PesticideType.CounterName).empty();
            $('#' + $.PesticideType.CounterName + ' input').val('');

            var members = [];
            $.each($.PesticideType.ColumnFilters, function (index, item) {
                item = '';
                members.push(index);
            });

            $.each(members, function (index, item) {
                $.PesticideType.ColumnFilters[item] = '';
            });

            $.PesticideType.Grid.invalidateAllRows();
            $('#' + $.PesticideType.GridContainer).empty();
        }

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    Instantiate: function () {
        // create a deferred object
        var def = $.Deferred();

        $.PesticideType.Data = [];
        $.PesticideType.ColumnFilters = {};
        $.PesticideType.DataView = new Slick.Data.DataView({
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
        for (var i = 0; i < $.PesticideType.Columns.length; i++) {
            switch ($.PesticideType.Columns[i]["id"]) {
                case 'Name':
                    $.PesticideType.Columns[i].header = {
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

    GetPesticideTypes: function () {
        // create a deferred object
        var def = $.Deferred();
        var states = '';

        // We get our data from the server
        $.ajax({
            type: 'GET',
            url: '/Lookup/GetPesticideTypes',
            data: {},
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    if (response.PesticideTypes.length == 0) {
                        // No data in report
                    } else {
                        for (var i = 0; i < response.PesticideTypes.length; i++) {
                            $.PesticideType.Data[i] = {
                                "id": response.PesticideTypes[i]["Id"],
                                "Name": response.PesticideTypes[i]["Name"],
                                "Code": response.PesticideTypes[i]["Code"]
                            };
                        }

                        $.PesticideType.DataView.setItems($.PesticideType.Data);

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
        var cookieCols = $.GUM.GetFromCookie($.PesticideType.CookieName);

        // We set the display columns to the manually defined columns
        $.PesticideType.DisplayColumns = $.PesticideType.Columns;

        if (cookieCols != null) {
            // Since the cookie exists we set the display columns to the JSON encoded column array in the cookie
            $.PesticideType.DisplayColumns = JSON.parse(cookieCols);

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
                for (k = 0; k < $.PesticideType.DisplayColumns.length; k++) {
                    if ($.PesticideType.DisplayColumns[k].id == columnData[i].Id) {
                        $.PesticideType.DisplayColumns[k][columnData[i].Action] = columnData[i].Data;
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
        //$.PesticideType.ColumnFilters = { Active: "true" };

        // We check the column filters and re-apply them and set the filter values into the text boxes
        $.each($.PesticideType.ColumnFilters, function (key, value) {
            $("[data-filterId='" + key + "']").val(value);
        })

        // Set the active filter and grid references
        $.CSF.globalColumnFilters = $.PesticideType.ColumnFilters;
        $.CSF.globalGridReference = $.PesticideType.Grid;
        $.PesticideType.DataView.refresh();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    InitializeGrid: function () {
        // create a deferred object
        var def = $.Deferred();

        $.PesticideType.Grid = new Slick.Grid("#" + $.PesticideType.GridContainer, $.PesticideType.DataView, $.PesticideType.DisplayColumns, $.PesticideType.GridOptions);

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
                    $.GUM.SaveToCookie($.PesticideType.CookieName, JSON.stringify($.PesticideType.Grid.getColumns()));
                    break;
                case 'Clear':
                    $.GUM.ClearFromCookie($.PesticideType.CookieName);
                    break;
                case 'Export':
                    $.GUM.ExportSlickGrid($.PesticideType.Grid, $.PesticideType.DataView);
                    break;
                default:
                    alert('Invalid menu command!');
            }
        });

        // register the header menu plugin
        $.PesticideType.Grid.registerPlugin(headerMenuPlugin);

        // Note that the columns are the manually defined columns, which is necessary for the column picker to have all columns in it, not just the ones saved in the cookie
        var activityColumnpicker = new Slick.Controls.ColumnPicker($.PesticideType.Columns, $.PesticideType.Grid, $.PesticideType.GridOptions);

        // register the group item metadata provider to add expand/collapse group handlers
        $.PesticideType.Grid.registerPlugin($.PesticideType.GroupItemMetadataProvider);

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    WireGridEvents: function () {
        // create a deferred object
        var def = $.Deferred();

        // Our scroll event
        $.PesticideType.Grid.onScroll.subscribe(function (e, args) {
            // Actions here
        });

        // Our sort function
        $.PesticideType.Grid.onSort.subscribe(function (e, args) {
            $.CSC.globalSortColumns = args.sortCols;
            $.PesticideType.DataView.sort($.CSC.globalMultiColumnComparer, args.sortAsc);
        });

        // Row count change event
        $.PesticideType.DataView.onRowCountChanged.subscribe(function (e, args) {
            $.PesticideType.Grid.updateRowCount();
            $.PesticideType.Grid.render();
            $.PesticideType.UpdateRecordCount();
        });

        // Row chnge event
        $.PesticideType.DataView.onRowsChanged.subscribe(function (e, args) {
            $.PesticideType.Grid.invalidateRows(args.rows);
            $.PesticideType.Grid.render();
        });

        // Delegate handler for the filters in the header row
        $($.PesticideType.Grid.getHeaderRow()).delegate(":input", "change keyup", function (e) {
            var columnId = $(this).data("columnId");
            if (columnId != null) {
                // We create a local copy of the filters and then assign the value to the global filters
                $.PesticideType.ColumnFilters[columnId] = $.trim($(this).val());
                $.CSF.globalColumnFilters = $.PesticideType.ColumnFilters;

                // We assign our grid to the global grid reference for the global search filter to use and then refresh the grid.  This allows multiple grids to use the same search filter
                $.CSF.globalGridReference = $.PesticideType.Grid;
                $.PesticideType.DataView.refresh();
                $.PesticideType.UpdateRecordCount();
            }
        });

        $.PesticideType.Grid.onHeaderRowCellRendered.subscribe(function (e, args) {
            $(args.node).empty();
            $("<input type='text'>")
               .data("columnId", args.column.id)
               .val($.CSF.globalColumnFilters[args.column.id])
                .attr("data-filterId", args.column.id)
               .appendTo(args.node);
        });

        $.PesticideType.DataView.setFilter($.CSF.globalFilter);
        $.PesticideType.Grid.init();

        $.PesticideType.UpdateRecordCount();
        $.PesticideType.ResizeGrid();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    UpdateRecordCount: function () {
        var negativeRows = $.PesticideType.DataView.getGroups().length * 2;
        $('#' + $.PesticideType.CounterName).text('| ' + Number($.PesticideType.DataView.getLength() - negativeRows) + ' Records');
    },

    ResizeGrid: function () {
        this.ResizeGridContainer();

        if ($.PesticideType.Grid) {
            $.PesticideType.Grid.resizeCanvas();
        }
    },

    ResizeGridContainer: function () {
        $('#' + $.PesticideType.GridContainer).height($(window).height() - $('#PesticideTypeFooter').height() - 5);
    }

}

function DisplayDetails(id) {
    $('#Overlay').show();
    $('#Details').show();
}

$(window).resize(function () {
    $.PesticideType.ResizeGrid();
});

$(window).load(function () {
    $.PesticideType.ResizeGridContainer();
    $.PesticideType.Driver();

    $('#ExportPesticideTypeGrid').click(function () {
        $.GUM.ExportSlickGrid($.PesticideType.Grid, $.PesticideType.DataView);
    });
});