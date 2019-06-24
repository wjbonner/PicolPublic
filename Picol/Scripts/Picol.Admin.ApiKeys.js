$.ApiKeyHelper = {
    QueueAndExecuteCommand: function (item, column, editCommand) {
        if (column['id'] == 'Name') {

        } else if (column['id'] == 'Active') {
            $.ajax({
                type: 'GET',
                url: '/Admin/ApiKeyActiveToggle',
                data: {id: item["id"] },
                dataType: "json",
                success: function (response) {
                    if (response.Error) {
                        alert(response.ErrorMessage);
                    }
                    else {
                        editCommand.execute();
                    }
                },
                error: function (response) {

                },
                complete: function (response) {

                }
            });
        } else if (column['id'] == 'Approved') {
            $.ajax({
                type: 'GET',
                url: '/Admin/ApiKeyApprovedToggle',
                data: { id: item["id"] },
                dataType: "json",
                success: function (response) {
                    if (response.Error) {
                        alert(response.ErrorMessage);
                    }
                    else {
                        editCommand.execute();
                    }
                },
                error: function (response) {

                },
                complete: function (response) {

                }
            });
        } else {
            editCommand.execute();
        }
    },

    ActionsFormatter: function (row, cell, value, columnDef, dataContext) {
        return "<a href='/Admin/ApiKeyDetails/" + dataContext["id"] + "'>Details</a>";
    }
}

$.ApiKey = {
    CookieName: "Picol.Search.Index.ApiKeyGrid",
    GridContainer: 'ApiKeyGrid',
    CounterName: 'ApiKeyCounter',
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
        { id: "Value", name: "Value", field: "Value", sortable: true },
        { id: "User", name: "User", field: "User", sortable: true },
        { id: "Active", name: "Active", field: "Active", sortable: true, formatter: Slick.Formatters.Checkmark, editor: Slick.Editors.Checkbox },
        { id: "Approved", name: "Approved", field: "Approved", sortable: true, formatter: Slick.Formatters.Checkmark, editor: Slick.Editors.Checkbox },
        { id: "Actions", name: "Actions", field: "Actions", sortable: false, formatter: $.ApiKeyHelper.ActionsFormatter }
    ],

    GridOptions: {
        enableCellNavigation: true,
        editable: true,
        forceFitColumns: true,
        editCommandHandler: $.ApiKeyHelper.QueueAndExecuteCommand,
        autoEdit: true,
        showHeaderRow: true,
        headerRowHeight: 40,
        explicitInitialization: true,
        multiColumnSort: true,
        enableTextSelectionOnCells: true
    },

    Driver: function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Retrieving ApiKeys');
        $.ApiKey.ResizeGridContainer();

        $.ApiKey.Clean()
            .done($.ApiKey.Instantiate)
            .done($.ApiKey.GetApiKeys)
            .done($.ApiKey.BuildMenu)
            .done($.ApiKey.ConfigureColumns)
            .done($.ApiKey.InitializeGrid)
            .done($.ApiKey.InitializeGridPlugins)
            .done($.ApiKey.WireGridEvents)
            .done($.ApiKey.ConfigureFilters);
    },

    Clean: function () {
        // create a deferred object
        var def = $.Deferred();

        if ($.ApiKey.Grid) {
            $('#' + $.ApiKey.CounterName).text('');
            $('#' + $.ApiKey.CounterName).empty();
            $('#' + $.ApiKey.CounterName + ' input').val('');

            var members = [];
            $.each($.ApiKey.ColumnFilters, function (index, item) {
                item = '';
                members.push(index);
            });

            $.each(members, function (index, item) {
                $.ApiKey.ColumnFilters[item] = '';
            });

            $.ApiKey.Grid.invalidateAllRows();
            $('#' + $.ApiKey.GridContainer).empty();
        }

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    Instantiate: function () {
        // create a deferred object
        var def = $.Deferred();

        $.ApiKey.Data = [];
        $.ApiKey.ColumnFilters = {};
        $.ApiKey.DataView = new Slick.Data.DataView({
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
        for (var i = 0; i < $.ApiKey.Columns.length; i++) {
            switch ($.ApiKey.Columns[i]["id"]) {
                case 'Name':
                    $.ApiKey.Columns[i].header = {
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

    GetApiKeys: function () {
        // create a deferred object
        var def = $.Deferred();
        var states = '';

        // We get our data from the server
        $.ajax({
            type: 'GET',
            url: '/Admin/GetApiKeys',
            data: { },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    if (response.ApiKeys.length == 0) {
                        // No data in report
                    } else {
                        for (var i = 0; i < response.ApiKeys.length; i++) {
                            $.ApiKey.Data[i] = {
                                "id": response.ApiKeys[i]["Id"],
                                "Value": response.ApiKeys[i]["Value"],
                                "User": response.ApiKeys[i]["User"],
                                "Active": response.ApiKeys[i]["Active"],
                                "Approved": response.ApiKeys[i]["Approved"],
                                "Actions": ""
                            };
                        }

                        $.ApiKey.DataView.setItems($.ApiKey.Data);

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
        var cookieCols = $.GUM.GetFromCookie($.ApiKey.CookieName);

        // We set the display columns to the manually defined columns
        $.ApiKey.DisplayColumns = $.ApiKey.Columns;

        if (cookieCols != null) {
            // Since the cookie exists we set the display columns to the JSON encoded column array in the cookie
            $.ApiKey.DisplayColumns = JSON.parse(cookieCols);

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
                for (k = 0; k < $.ApiKey.DisplayColumns.length; k++) {
                    if ($.ApiKey.DisplayColumns[k].id == columnData[i].Id) {
                        $.ApiKey.DisplayColumns[k][columnData[i].Action] = columnData[i].Data;
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
        //$.ApiKey.ColumnFilters = { Active: "true" };

        // We check the column filters and re-apply them and set the filter values into the text boxes
        $.each($.ApiKey.ColumnFilters, function (key, value) {
            $("[data-filterId='" + key + "']").val(value);
        })

        // Set the active filter and grid references
        $.CSF.globalColumnFilters = $.ApiKey.ColumnFilters;
        $.CSF.globalGridReference = $.ApiKey.Grid;
        $.ApiKey.DataView.refresh();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    InitializeGrid: function () {
        // create a deferred object
        var def = $.Deferred();

        $.ApiKey.Grid = new Slick.Grid("#" + $.ApiKey.GridContainer, $.ApiKey.DataView, $.ApiKey.DisplayColumns, $.ApiKey.GridOptions);

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
                    $.GUM.SaveToCookie($.ApiKey.CookieName, JSON.stringify($.ApiKey.Grid.getColumns()));
                    break;
                case 'Clear':
                    $.GUM.ClearFromCookie($.ApiKey.CookieName);
                    break;
                case 'Export':
                    $.GUM.ExportSlickGrid($.ApiKey.Grid, $.ApiKey.DataView);
                    break;
                default:
                    alert('Invalid menu command!');
            }
        });

        // register the header menu plugin
        $.ApiKey.Grid.registerPlugin(headerMenuPlugin);

        // Note that the columns are the manually defined columns, which is necessary for the column picker to have all columns in it, not just the ones saved in the cookie
        var activityColumnpicker = new Slick.Controls.ColumnPicker($.ApiKey.Columns, $.ApiKey.Grid, $.ApiKey.GridOptions);

        // register the group item metadata provider to add expand/collapse group handlers
        $.ApiKey.Grid.registerPlugin($.ApiKey.GroupItemMetadataProvider);

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    WireGridEvents: function () {
        // create a deferred object
        var def = $.Deferred();

        // Our scroll event
        $.ApiKey.Grid.onScroll.subscribe(function (e, args) {
            // Actions here
        });

        // Our sort function
        $.ApiKey.Grid.onSort.subscribe(function (e, args) {
            $.CSC.globalSortColumns = args.sortCols;
            $.ApiKey.DataView.sort($.CSC.globalMultiColumnComparer, args.sortAsc);
        });

        // Row count change event
        $.ApiKey.DataView.onRowCountChanged.subscribe(function (e, args) {
            $.ApiKey.Grid.updateRowCount();
            $.ApiKey.Grid.render();
            $.ApiKey.UpdateRecordCount();
        });

        // Row chnge event
        $.ApiKey.DataView.onRowsChanged.subscribe(function (e, args) {
            $.ApiKey.Grid.invalidateRows(args.rows);
            $.ApiKey.Grid.render();
        });

        // Delegate handler for the filters in the header row
        $($.ApiKey.Grid.getHeaderRow()).delegate(":input", "change keyup", function (e) {
            var columnId = $(this).data("columnId");
            if (columnId != null) {
                // We create a local copy of the filters and then assign the value to the global filters
                $.ApiKey.ColumnFilters[columnId] = $.trim($(this).val());
                $.CSF.globalColumnFilters = $.ApiKey.ColumnFilters;

                // We assign our grid to the global grid reference for the global search filter to use and then refresh the grid.  This allows multiple grids to use the same search filter
                $.CSF.globalGridReference = $.ApiKey.Grid;
                $.ApiKey.DataView.refresh();
                $.ApiKey.UpdateRecordCount();
            }
        });

        $.ApiKey.Grid.onHeaderRowCellRendered.subscribe(function (e, args) {
            $(args.node).empty();
            $("<input type='text'>")
               .data("columnId", args.column.id)
               .val($.CSF.globalColumnFilters[args.column.id])
                .attr("data-filterId", args.column.id)
               .appendTo(args.node);
        });

        $.ApiKey.DataView.setFilter($.CSF.globalFilter);
        $.ApiKey.Grid.init();

        $.ApiKey.UpdateRecordCount();
        $.ApiKey.ResizeGrid();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    UpdateRecordCount: function () {
        var negativeRows = $.ApiKey.DataView.getGroups().length * 2;
        $('#' + $.ApiKey.CounterName).text('| ' + Number($.ApiKey.DataView.getLength() - negativeRows) + ' Records');
    },

    ResizeGrid: function () {
        this.ResizeGridContainer();

        if ($.ApiKey.Grid) {
            $.ApiKey.Grid.resizeCanvas();
        }
    },

    ResizeGridContainer: function () {
        $('#' + $.ApiKey.GridContainer).height($(window).height() - $('#SearchPanel').height() - 35);
    }
   
}

function DisplayDetails(id) {
    $('#Overlay').show();
    $('#Details').show();
}

$(window).resize(function () {
    $.ApiKey.ResizeGrid();
});

$(window).load(function () {
    $.ApiKey.ResizeGridContainer();
    $.ApiKey.Driver();

    $('#ExportApiKeyGrid').click(function () {
        $.GUM.ExportSlickGrid($.ApiKey.Grid, $.ApiKey.DataView);
    });
});