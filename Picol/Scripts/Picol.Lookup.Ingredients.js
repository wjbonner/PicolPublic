$.IngredientHelper = {
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

$.Ingredient = {
    CookieName: "Picol.Search.Index.IngredientGrid",
    GridContainer: 'IngredientGrid',
    CounterName: 'IngredientCounter',
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
        { id: "Name", name: "Name", field: "Name", sortable: true, maxWidth: 500 },
        { id: "Code", name: "Code", field: "Code", sortable: true, maxWidth: 80 },
        { id: "Notes", name: "Notes", field: "Notes", sortable: true },
        { id: "ResistanceSource", name: "Resistance Source", field: "ResistanceSource", sortable: true },
        { id: "ResistanceCode", name: "Resistance Code", field: "ResistanceCode", sortable: true },
        { id: "ResistanceMethodOfAction", name: "Resistance MOA", field: "ResistanceMethodOfAction", sortable: true }
    ],

    GridOptions: {
        enableCellNavigation: true,
        editable: true,
        forceFitColumns: true,
        editCommandHandler: $.IngredientHelper.QueueAndExecuteCommand,
        autoEdit: true,
        showHeaderRow: true,
        headerRowHeight: 40,
        explicitInitialization: true,
        multiColumnSort: true,
        enableTextSelectionOnCells: true
    },

    Driver: function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Retrieving Ingredients');
        $.Ingredient.ResizeGridContainer();

        $.Ingredient.Clean()
            .done($.Ingredient.Instantiate)
            .done($.Ingredient.GetIngredients)
            .done($.Ingredient.BuildMenu)
            .done($.Ingredient.ConfigureColumns)
            .done($.Ingredient.InitializeGrid)
            .done($.Ingredient.InitializeGridPlugins)
            .done($.Ingredient.WireGridEvents)
            .done($.Ingredient.ConfigureFilters);
    },

    Clean: function () {
        // create a deferred object
        var def = $.Deferred();

        if ($.Ingredient.Grid) {
            $('#' + $.Ingredient.CounterName).text('');
            $('#' + $.Ingredient.CounterName).empty();
            $('#' + $.Ingredient.CounterName + ' input').val('');

            var members = [];
            $.each($.Ingredient.ColumnFilters, function (index, item) {
                item = '';
                members.push(index);
            });

            $.each(members, function (index, item) {
                $.Ingredient.ColumnFilters[item] = '';
            });

            $.Ingredient.Grid.invalidateAllRows();
            $('#' + $.Ingredient.GridContainer).empty();
        }

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    Instantiate: function () {
        // create a deferred object
        var def = $.Deferred();

        $.Ingredient.Data = [];
        $.Ingredient.ColumnFilters = {};
        $.Ingredient.DataView = new Slick.Data.DataView({
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
        for (var i = 0; i < $.Ingredient.Columns.length; i++) {
            switch ($.Ingredient.Columns[i]["id"]) {
                case 'Name':
                    $.Ingredient.Columns[i].header = {
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

    GetIngredients: function () {
        // create a deferred object
        var def = $.Deferred();
        var states = '';

        // We get our data from the server
        $.ajax({
            type: 'GET',
            url: '/Lookup/GetIngredients',
            data: {},
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    if (response.Ingredients.length == 0) {
                        // No data in report
                    } else {
                        for (var i = 0; i < response.Ingredients.length; i++) {
                            $.Ingredient.Data[i] = {
                                "id": response.Ingredients[i]["Id"],
                                "Name": response.Ingredients[i]["Name"],
                                "Code": response.Ingredients[i]["Code"],
                                "Notes": response.Ingredients[i]["Notes"],
                                "ResistanceSource": response.Ingredients[i]["ResistanceSource"],
                                "ResistanceCode": response.Ingredients[i]["ResistanceCode"],
                                "ResistanceMethodOfAction": response.Ingredients[i]["ResistanceMethodOfAction"]
                            };
                        }

                        $.Ingredient.DataView.setItems($.Ingredient.Data);

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
        var cookieCols = $.GUM.GetFromCookie($.Ingredient.CookieName);

        // We set the display columns to the manually defined columns
        $.Ingredient.DisplayColumns = $.Ingredient.Columns;

        if (cookieCols != null) {
            // Since the cookie exists we set the display columns to the JSON encoded column array in the cookie
            $.Ingredient.DisplayColumns = JSON.parse(cookieCols);

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
                for (k = 0; k < $.Ingredient.DisplayColumns.length; k++) {
                    if ($.Ingredient.DisplayColumns[k].id == columnData[i].Id) {
                        $.Ingredient.DisplayColumns[k][columnData[i].Action] = columnData[i].Data;
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
        //$.Ingredient.ColumnFilters = { Active: "true" };

        // We check the column filters and re-apply them and set the filter values into the text boxes
        $.each($.Ingredient.ColumnFilters, function (key, value) {
            $("[data-filterId='" + key + "']").val(value);
        })

        // Set the active filter and grid references
        $.CSF.globalColumnFilters = $.Ingredient.ColumnFilters;
        $.CSF.globalGridReference = $.Ingredient.Grid;
        $.Ingredient.DataView.refresh();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    InitializeGrid: function () {
        // create a deferred object
        var def = $.Deferred();

        $.Ingredient.Grid = new Slick.Grid("#" + $.Ingredient.GridContainer, $.Ingredient.DataView, $.Ingredient.DisplayColumns, $.Ingredient.GridOptions);

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
                    $.GUM.SaveToCookie($.Ingredient.CookieName, JSON.stringify($.Ingredient.Grid.getColumns()));
                    break;
                case 'Clear':
                    $.GUM.ClearFromCookie($.Ingredient.CookieName);
                    break;
                case 'Export':
                    $.GUM.ExportSlickGrid($.Ingredient.Grid, $.Ingredient.DataView);
                    break;
                default:
                    alert('Invalid menu command!');
            }
        });

        // register the header menu plugin
        $.Ingredient.Grid.registerPlugin(headerMenuPlugin);

        // Note that the columns are the manually defined columns, which is necessary for the column picker to have all columns in it, not just the ones saved in the cookie
        var activityColumnpicker = new Slick.Controls.ColumnPicker($.Ingredient.Columns, $.Ingredient.Grid, $.Ingredient.GridOptions);

        // register the group item metadata provider to add expand/collapse group handlers
        $.Ingredient.Grid.registerPlugin($.Ingredient.GroupItemMetadataProvider);

        // Enable auto tool tips
        $.Ingredient.Grid.registerPlugin(new Slick.AutoTooltips());

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    WireGridEvents: function () {
        // create a deferred object
        var def = $.Deferred();

        // Our scroll event
        $.Ingredient.Grid.onScroll.subscribe(function (e, args) {
            // Actions here
        });

        // Our sort function
        $.Ingredient.Grid.onSort.subscribe(function (e, args) {
            $.CSC.globalSortColumns = args.sortCols;
            $.Ingredient.DataView.sort($.CSC.globalMultiColumnComparer, args.sortAsc);
        });

        // Row count change event
        $.Ingredient.DataView.onRowCountChanged.subscribe(function (e, args) {
            $.Ingredient.Grid.updateRowCount();
            $.Ingredient.Grid.render();
            $.Ingredient.UpdateRecordCount();
        });

        // Row chnge event
        $.Ingredient.DataView.onRowsChanged.subscribe(function (e, args) {
            $.Ingredient.Grid.invalidateRows(args.rows);
            $.Ingredient.Grid.render();
        });

        // Delegate handler for the filters in the header row
        $($.Ingredient.Grid.getHeaderRow()).delegate(":input", "change keyup", function (e) {
            var columnId = $(this).data("columnId");
            if (columnId != null) {
                // We create a local copy of the filters and then assign the value to the global filters
                $.Ingredient.ColumnFilters[columnId] = $.trim($(this).val());
                $.CSF.globalColumnFilters = $.Ingredient.ColumnFilters;

                // We assign our grid to the global grid reference for the global search filter to use and then refresh the grid.  This allows multiple grids to use the same search filter
                $.CSF.globalGridReference = $.Ingredient.Grid;
                $.Ingredient.DataView.refresh();
                $.Ingredient.UpdateRecordCount();
            }
        });

        $.Ingredient.Grid.onHeaderRowCellRendered.subscribe(function (e, args) {
            $(args.node).empty();
            $("<input type='text'>")
               .data("columnId", args.column.id)
               .val($.CSF.globalColumnFilters[args.column.id])
                .attr("data-filterId", args.column.id)
               .appendTo(args.node);
        });

        $.Ingredient.DataView.setFilter($.CSF.globalFilter);
        $.Ingredient.Grid.init();

        $.Ingredient.UpdateRecordCount();
        $.Ingredient.ResizeGrid();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    UpdateRecordCount: function () {
        var negativeRows = $.Ingredient.DataView.getGroups().length * 2;
        $('#' + $.Ingredient.CounterName).text('| ' + Number($.Ingredient.DataView.getLength() - negativeRows) + ' Records');
    },

    ResizeGrid: function () {
        this.ResizeGridContainer();

        if ($.Ingredient.Grid) {
            $.Ingredient.Grid.resizeCanvas();
        }
    },

    ResizeGridContainer: function () {
        $('#' + $.Ingredient.GridContainer).height($(window).height() - $('#IngredientFooter').height() - 5);
    }

}

function DisplayDetails(id) {
    $('#Overlay').show();
    $('#Details').show();
}

$(window).resize(function () {
    $.Ingredient.ResizeGrid();
});

$(window).load(function () {
    $.Ingredient.ResizeGridContainer();
    $.Ingredient.Driver();

    $('#ExportIngredientGrid').click(function () {
        $.GUM.ExportSlickGrid($.Ingredient.Grid, $.Ingredient.DataView);
    });
});