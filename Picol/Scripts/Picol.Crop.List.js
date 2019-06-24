$.CropHelper = {
    QueueAndExecuteCommand: function (item, column, editCommand) {
        if (column['id'] == 'Name') {
            $.Crop.Update(item.id, editCommand.serializedValue, item.Code, item.Notes, editCommand);
        } else if (column['id'] == 'Code') {
            $.Crop.Update(item.id, item.Name, editCommand.serializedValue, item.Notes, editCommand);
        } else if (column['id'] == 'Notes') {
            $.Crop.Update(item.id, item.Name, item.Code, editCommand.serializedValue, editCommand);
        } else {
            editCommand.execute();
            $('#OverlayDisplay').hide();
        }
    },

    ActionsFormatter: function (row, cell, value, columnDef, dataContext) {
        var details = "<a href='/Crop/Details/" + dataContext["id"] + "'>Details</a>";
        var del = "<a href='javascript:void(0)' onclick='$.Crop.Delete(" + dataContext["id"] + ")'>Delete</a>";
        return details + " | " + del;
    }
}

$.Crop = {
    CookieName: "Picol.Crop.List.Grid",
    GridContainer: 'CropGrid',
    CounterName: 'CropCounter',
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
        { id: "Notes", name: "Notes", field: "Notes", sortable: true, editor: Slick.Editors.Text },
        { id: "Actions", name: "Actions", field: "Actions", sortable: true, formatter: $.CropHelper.ActionsFormatter }
    ],

    GridOptions: {
        enableCellNavigation: true,
        editable: true,
        forceFitColumns: true,
        editCommandHandler: $.CropHelper.QueueAndExecuteCommand,
        autoEdit: true,
        showHeaderRow: true,
        headerRowHeight: 40,
        explicitInitialization: true,
        multiColumnSort: true,
        enableTextSelectionOnCells: true
    },

    Driver: function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Retrieving Crops');
        $.Crop.ResizeGridContainer();

        $.Crop.Clean()
            .done($.Crop.Instantiate)
            .done($.Crop.GetCrops)
            .done($.Crop.BuildMenu)
            .done($.Crop.ConfigureColumns)
            .done($.Crop.InitializeGrid)
            .done($.Crop.InitializeGridPlugins)
            .done($.Crop.WireGridEvents)
            .done($.Crop.ConfigureFilters);
    },

    Clean: function () {
        // create a deferred object
        var def = $.Deferred();

        if ($.Crop.Grid) {
            $('#' + $.Crop.CounterName).text('');
            $('#' + $.Crop.CounterName).empty();
            $('#' + $.Crop.CounterName + ' input').val('');

            var members = [];
            $.each($.Crop.ColumnFilters, function (index, item) {
                item = '';
                members.push(index);
            });

            $.each(members, function (index, item) {
                $.Crop.ColumnFilters[item] = '';
            });

            $.Crop.Grid.invalidateAllRows();
            $('#' + $.Crop.GridContainer).empty();
        }

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    Instantiate: function () {
        // create a deferred object
        var def = $.Deferred();

        $.Crop.Data = [];
        $.Crop.ColumnFilters = {};
        $.Crop.DataView = new Slick.Data.DataView({
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
        for (var i = 0; i < $.Crop.Columns.length; i++) {
            switch ($.Crop.Columns[i]["id"]) {
                case 'Name':
                    $.Crop.Columns[i].header = {
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

    GetCrops: function () {
        // create a deferred object
        var def = $.Deferred();

        // We get our data from the server
        $.ajax({
            type: 'GET',
            url: '/Crop/Get',
            data: {},
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    if (response.Crops.length == 0) {
                        // No data in report
                    } else {
                        for (var i = 0; i < response.Crops.length; i++) {
                            $.Crop.Data[i] = {
                                "id": response.Crops[i]["Id"],
                                "Name": response.Crops[i]["Name"],
                                "Code": response.Crops[i]["Code"],
                                "Notes": response.Crops[i]["Notes"],
                                "Actions": ""
                            };
                        }

                        $.Crop.DataView.setItems($.Crop.Data);

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
        var cookieCols = $.GUM.GetFromCookie($.Crop.CookieName);

        // We set the display columns to the manually defined columns
        $.Crop.DisplayColumns = $.Crop.Columns;

        if (cookieCols != null) {
            // Since the cookie exists we set the display columns to the JSON encoded column array in the cookie
            $.Crop.DisplayColumns = JSON.parse(cookieCols);

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
                for (k = 0; k < $.Crop.DisplayColumns.length; k++) {
                    if ($.Crop.DisplayColumns[k].id == columnData[i].Id) {
                        $.Crop.DisplayColumns[k][columnData[i].Action] = columnData[i].Data;
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
        //$.Crop.ColumnFilters = { Active: "true" };

        // We check the column filters and re-apply them and set the filter values into the text boxes
        $.each($.Crop.ColumnFilters, function (key, value) {
            $("[data-filterId='" + key + "']").val(value);
        })

        // Set the active filter and grid references
        $.CSF.globalColumnFilters = $.Crop.ColumnFilters;
        $.CSF.globalGridReference = $.Crop.Grid;
        $.Crop.DataView.refresh();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    InitializeGrid: function () {
        // create a deferred object
        var def = $.Deferred();

        $.Crop.Grid = new Slick.Grid("#" + $.Crop.GridContainer, $.Crop.DataView, $.Crop.DisplayColumns, $.Crop.GridOptions);

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
                    $.GUM.SaveToCookie($.Crop.CookieName, JSON.stringify($.Crop.Grid.getColumns()));
                    break;
                case 'Clear':
                    $.GUM.ClearFromCookie($.Crop.CookieName);
                    break;
                case 'Export':
                    $.GUM.ExportSlickGrid($.Crop.Grid, $.Crop.DataView);
                    break;
                default:
                    alert('Invalid menu command!');
            }
        });

        // register the header menu plugin
        $.Crop.Grid.registerPlugin(headerMenuPlugin);

        // Note that the columns are the manually defined columns, which is necessary for the column picker to have all columns in it, not just the ones saved in the cookie
        var activityColumnpicker = new Slick.Controls.ColumnPicker($.Crop.Columns, $.Crop.Grid, $.Crop.GridOptions);

        // register the group item metadata provider to add expand/collapse group handlers
        $.Crop.Grid.registerPlugin($.Crop.GroupItemMetadataProvider);

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    WireGridEvents: function () {
        // create a deferred object
        var def = $.Deferred();

        // Our scroll event
        $.Crop.Grid.onScroll.subscribe(function (e, args) {
            // Actions here
        });

        // Our sort function
        $.Crop.Grid.onSort.subscribe(function (e, args) {
            $.CSC.globalSortColumns = args.sortCols;
            $.Crop.DataView.sort($.CSC.globalMultiColumnComparer, args.sortAsc);
        });

        // Row count change event
        $.Crop.DataView.onRowCountChanged.subscribe(function (e, args) {
            $.Crop.Grid.updateRowCount();
            $.Crop.Grid.render();
            $.Crop.UpdateRecordCount();
        });

        // Row chnge event
        $.Crop.DataView.onRowsChanged.subscribe(function (e, args) {
            $.Crop.Grid.invalidateRows(args.rows);
            $.Crop.Grid.render();
        });

        // Delegate handler for the filters in the header row
        $($.Crop.Grid.getHeaderRow()).delegate(":input", "change keyup", function (e) {
            var columnId = $(this).data("columnId");
            if (columnId != null) {
                // We create a local copy of the filters and then assign the value to the global filters
                $.Crop.ColumnFilters[columnId] = $.trim($(this).val());
                $.CSF.globalColumnFilters = $.Crop.ColumnFilters;

                // We assign our grid to the global grid reference for the global search filter to use and then refresh the grid.  This allows multiple grids to use the same search filter
                $.CSF.globalGridReference = $.Crop.Grid;
                $.Crop.DataView.refresh();
                $.Crop.UpdateRecordCount();
            }
        });

        $.Crop.Grid.onHeaderRowCellRendered.subscribe(function (e, args) {
            $(args.node).empty();
            $("<input type='text'>")
               .data("columnId", args.column.id)
               .val($.CSF.globalColumnFilters[args.column.id])
                .attr("data-filterId", args.column.id)
               .appendTo(args.node);
        });

        $.Crop.DataView.setFilter($.CSF.globalFilter);
        $.Crop.Grid.init();

        $.Crop.UpdateRecordCount();
        $.Crop.ResizeGrid();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    UpdateRecordCount: function () {
        var negativeRows = $.Crop.DataView.getGroups().length * 2;
        $('#' + $.Crop.CounterName).text('| ' + Number($.Crop.DataView.getLength() - negativeRows) + ' Records');
    },

    ResizeGrid: function () {
        this.ResizeGridContainer();

        if ($.Crop.Grid) {
            $.Crop.Grid.resizeCanvas();
        }
    },

    ResizeGridContainer: function () {
        $('#' + $.Crop.GridContainer).height($(window).height() - 35);
    },

    Create: function () {
        $.ajax({
            type: 'POST',
            url: '/Crop/Create',
            data: { code: $('#Code').val(), name: $('#Name').val(), notes: $("#Notes").val() },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    $.Crop.DataView.addItem({
                        id: response.Crop.Id,
                        Name: response.Crop.Name,
                        Code: response.Crop.Code,
                        Notes: response.Crop.Notes,
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

    Update: function (id, name, code, notes, editCommand) {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Updating');

        $.ajax({
            type: 'POST',
            url: '/Crop/Update',
            data: { id: id, name: name, code: code, notes: notes },
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
        if (!confirm('Are you sure you want to permenantly and irrevocably delete this crop and all associated records?')) {
            return;
        }

        $.ajax({
            type: 'POST',
            url: '/Crop/Delete',
            data: { id: id },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    $.Crop.DataView.deleteItem(id);
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
    $.Crop.ResizeGrid();
});

$(window).load(function () {
    $.Crop.ResizeGridContainer();
    $.Crop.Driver();

    $('#ExportCropGrid').click(function () {
        $.GUM.ExportSlickGrid($.Crop.Grid, $.Crop.DataView);
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
        $.Crop.Create();
    });
});