$.CropGroupHelper = {
    QueueAndExecuteCommand: function (item, column, editCommand) {
        if (column['id'] == 'Name') {
            $.CropGroup.Update(item.id, editCommand.serializedValue, editCommand);
        } else {
            editCommand.execute();
            $('#OverlayDisplay').hide();
        }
    },

    ActionsFormatter: function (row, cell, value, columnDef, dataContext) {
        var details = "<a href='/CropGroup/Details/" + dataContext["id"] + "'>Details</a>";
        var del = "<a href='javascript:void(0)' onclick='$.CropGroup.Delete(" + dataContext["id"] + ")'>Delete</a>";
        return details + " | " + del;
    }
}

$.CropGroup = {
    CookieName: "Picol.CropGroup.List.Grid",
    GridContainer: 'CropGroupGrid',
    CounterName: 'CropGroupCounter',
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
        { id: "Actions", name: "Actions", field: "Actions", sortable: true, formatter: $.CropGroupHelper.ActionsFormatter }
    ],

    GridOptions: {
        enableCellNavigation: true,
        editable: true,
        forceFitColumns: true,
        editCommandHandler: $.CropGroupHelper.QueueAndExecuteCommand,
        autoEdit: true,
        showHeaderRow: true,
        headerRowHeight: 40,
        explicitInitialization: true,
        multiColumnSort: true,
        enableTextSelectionOnCells: true
    },

    Driver: function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Retrieving CropGroups');
        $.CropGroup.ResizeGridContainer();

        $.CropGroup.Clean()
            .done($.CropGroup.Instantiate)
            .done($.CropGroup.GetCropGroups)
            .done($.CropGroup.BuildMenu)
            .done($.CropGroup.ConfigureColumns)
            .done($.CropGroup.InitializeGrid)
            .done($.CropGroup.InitializeGridPlugins)
            .done($.CropGroup.WireGridEvents)
            .done($.CropGroup.ConfigureFilters);
    },

    Clean: function () {
        // create a deferred object
        var def = $.Deferred();

        if ($.CropGroup.Grid) {
            $('#' + $.CropGroup.CounterName).text('');
            $('#' + $.CropGroup.CounterName).empty();
            $('#' + $.CropGroup.CounterName + ' input').val('');

            var members = [];
            $.each($.CropGroup.ColumnFilters, function (index, item) {
                item = '';
                members.push(index);
            });

            $.each(members, function (index, item) {
                $.CropGroup.ColumnFilters[item] = '';
            });

            $.CropGroup.Grid.invalidateAllRows();
            $('#' + $.CropGroup.GridContainer).empty();
        }

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    Instantiate: function () {
        // create a deferred object
        var def = $.Deferred();

        $.CropGroup.Data = [];
        $.CropGroup.ColumnFilters = {};
        $.CropGroup.DataView = new Slick.Data.DataView({
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
        for (var i = 0; i < $.CropGroup.Columns.length; i++) {
            switch ($.CropGroup.Columns[i]["id"]) {
                case 'Name':
                    $.CropGroup.Columns[i].header = {
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

    GetCropGroups: function () {
        // create a deferred object
        var def = $.Deferred();

        // We get our data from the server
        $.ajax({
            type: 'GET',
            url: '/CropGroup/Get',
            data: {},
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    if (response.CropGroups.length == 0) {
                        // No data in report
                    } else {
                        for (var i = 0; i < response.CropGroups.length; i++) {
                            $.CropGroup.Data[i] = {
                                "id": response.CropGroups[i]["Id"],
                                "Name": response.CropGroups[i]["Name"],
                                "Actions": ""
                            };
                        }

                        $.CropGroup.DataView.setItems($.CropGroup.Data);

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
        var cookieCols = $.GUM.GetFromCookie($.CropGroup.CookieName);

        // We set the display columns to the manually defined columns
        $.CropGroup.DisplayColumns = $.CropGroup.Columns;

        if (cookieCols != null) {
            // Since the cookie exists we set the display columns to the JSON encoded column array in the cookie
            $.CropGroup.DisplayColumns = JSON.parse(cookieCols);

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
                for (k = 0; k < $.CropGroup.DisplayColumns.length; k++) {
                    if ($.CropGroup.DisplayColumns[k].id == columnData[i].Id) {
                        $.CropGroup.DisplayColumns[k][columnData[i].Action] = columnData[i].Data;
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
        //$.CropGroup.ColumnFilters = { Active: "true" };

        // We check the column filters and re-apply them and set the filter values into the text boxes
        $.each($.CropGroup.ColumnFilters, function (key, value) {
            $("[data-filterId='" + key + "']").val(value);
        })

        // Set the active filter and grid references
        $.CSF.globalColumnFilters = $.CropGroup.ColumnFilters;
        $.CSF.globalGridReference = $.CropGroup.Grid;
        $.CropGroup.DataView.refresh();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    InitializeGrid: function () {
        // create a deferred object
        var def = $.Deferred();

        $.CropGroup.Grid = new Slick.Grid("#" + $.CropGroup.GridContainer, $.CropGroup.DataView, $.CropGroup.DisplayColumns, $.CropGroup.GridOptions);

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
                    $.GUM.SaveToCookie($.CropGroup.CookieName, JSON.stringify($.CropGroup.Grid.getColumns()));
                    break;
                case 'Clear':
                    $.GUM.ClearFromCookie($.CropGroup.CookieName);
                    break;
                case 'Export':
                    $.GUM.ExportSlickGrid($.CropGroup.Grid, $.CropGroup.DataView);
                    break;
                default:
                    alert('Invalid menu command!');
            }
        });

        // register the header menu plugin
        $.CropGroup.Grid.registerPlugin(headerMenuPlugin);

        // Note that the columns are the manually defined columns, which is necessary for the column picker to have all columns in it, not just the ones saved in the cookie
        var activityColumnpicker = new Slick.Controls.ColumnPicker($.CropGroup.Columns, $.CropGroup.Grid, $.CropGroup.GridOptions);

        // register the group item metadata provider to add expand/collapse group handlers
        $.CropGroup.Grid.registerPlugin($.CropGroup.GroupItemMetadataProvider);

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    WireGridEvents: function () {
        // create a deferred object
        var def = $.Deferred();

        // Our scroll event
        $.CropGroup.Grid.onScroll.subscribe(function (e, args) {
            // Actions here
        });

        // Our sort function
        $.CropGroup.Grid.onSort.subscribe(function (e, args) {
            $.CSC.globalSortColumns = args.sortCols;
            $.CropGroup.DataView.sort($.CSC.globalMultiColumnComparer, args.sortAsc);
        });

        // Row count change event
        $.CropGroup.DataView.onRowCountChanged.subscribe(function (e, args) {
            $.CropGroup.Grid.updateRowCount();
            $.CropGroup.Grid.render();
            $.CropGroup.UpdateRecordCount();
        });

        // Row chnge event
        $.CropGroup.DataView.onRowsChanged.subscribe(function (e, args) {
            $.CropGroup.Grid.invalidateRows(args.rows);
            $.CropGroup.Grid.render();
        });

        // Delegate handler for the filters in the header row
        $($.CropGroup.Grid.getHeaderRow()).delegate(":input", "change keyup", function (e) {
            var columnId = $(this).data("columnId");
            if (columnId != null) {
                // We create a local copy of the filters and then assign the value to the global filters
                $.CropGroup.ColumnFilters[columnId] = $.trim($(this).val());
                $.CSF.globalColumnFilters = $.CropGroup.ColumnFilters;

                // We assign our grid to the global grid reference for the global search filter to use and then refresh the grid.  This allows multiple grids to use the same search filter
                $.CSF.globalGridReference = $.CropGroup.Grid;
                $.CropGroup.DataView.refresh();
                $.CropGroup.UpdateRecordCount();
            }
        });

        $.CropGroup.Grid.onHeaderRowCellRendered.subscribe(function (e, args) {
            $(args.node).empty();
            $("<input type='text'>")
               .data("columnId", args.column.id)
               .val($.CSF.globalColumnFilters[args.column.id])
                .attr("data-filterId", args.column.id)
               .appendTo(args.node);
        });

        $.CropGroup.DataView.setFilter($.CSF.globalFilter);
        $.CropGroup.Grid.init();

        $.CropGroup.UpdateRecordCount();
        $.CropGroup.ResizeGrid();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    UpdateRecordCount: function () {
        var negativeRows = $.CropGroup.DataView.getGroups().length * 2;
        $('#' + $.CropGroup.CounterName).text('| ' + Number($.CropGroup.DataView.getLength() - negativeRows) + ' Records');
    },

    ResizeGrid: function () {
        this.ResizeGridContainer();

        if ($.CropGroup.Grid) {
            $.CropGroup.Grid.resizeCanvas();
        }
    },

    ResizeGridContainer: function () {
        $('#' + $.CropGroup.GridContainer).height($(window).height() - $('#SearchPanel').height() - 35);
    },

    Create: function () {
        $.ajax({
            type: 'POST',
            url: '/CropGroup/Create',
            data: { code: $('#Code').val(), name: $('#Name').val() },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    $('#Code').val("");
                    $('#Name').val("");
                    $.CropGroup.DataView.addItem({
                        id: response.CropGroup.Id,
                        Name: response.CropGroup.Name,
                        Code: response.CropGroup.Code,
                    });
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

    Update: function (id, name, editCommand) {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Updating');

        $.ajax({
            type: 'POST',
            url: '/CropGroup/Update',
            data: { id: id, name: name },
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
        if (!confirm('Are you sure you want to permenantly and irrevocably delete this cropGroup and all associated records?')) {
            return;
        }

        $.ajax({
            type: 'POST',
            url: '/CropGroup/Delete',
            data: { id: id },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    $.CropGroup.DataView.deleteItem(id);
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
    $.CropGroup.ResizeGrid();
});

$(window).load(function () {
    $.CropGroup.ResizeGridContainer();
    $.CropGroup.Driver();

    $('#ExportCropGroupGrid').click(function () {
        $.GUM.ExportSlickGrid($.CropGroup.Grid, $.CropGroup.DataView);
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
        $.CropGroup.Create();
    });
});