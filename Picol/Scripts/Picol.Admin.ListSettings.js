$.SettingHelper = {
    QueueAndExecuteCommand: function (item, column, editCommand) {
        if (column['id'] == 'Value') {
            $.Setting.Update(item.id, editCommand.serializedValue, editCommand);
        } else if (column['id'] == 'FirstName') {
            editCommand.execute();
            $('#OverlayDisplay').hide();
        }
    },

    ActionsFormatter: function (row, cell, value, columnDef, dataContext) {
        var details = "<a href='/Setting/Details/" + dataContext["id"] + "'>Details</a>";
        var del = "<a href='javascript:void(0)' onclick='$.Setting.Delete(" + dataContext["id"] + ")'>Delete</a>";
        return details + " | " + del;
    }
}

$.Setting = {
    CookieName: "Picol.Setting.List.Grid",
    GridContainer: 'SettingGrid',
    CounterName: 'SettingCounter',
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
        { id: "Value", name: "Value", field: "Value", sortable: true, editor: Slick.Editors.Text }
    ],

    GridOptions: {
        enableCellNavigation: true,
        editable: true,
        forceFitColumns: true,
        editCommandHandler: $.SettingHelper.QueueAndExecuteCommand,
        autoEdit: true,
        showHeaderRow: true,
        headerRowHeight: 40,
        explicitInitialization: true,
        multiColumnSort: true,
        enableTextSelectionOnCells: true
    },

    Driver: function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Retrieving Settings');
        $.Setting.ResizeGridContainer();

        $.Setting.Clean()
            .done($.Setting.Instantiate)
            .done($.Setting.GetSettings)
            .done($.Setting.BuildMenu)
            .done($.Setting.ConfigureColumns)
            .done($.Setting.InitializeGrid)
            .done($.Setting.InitializeGridPlugins)
            .done($.Setting.WireGridEvents)
            .done($.Setting.ConfigureFilters);
    },

    Clean: function () {
        // create a deferred object
        var def = $.Deferred();

        if ($.Setting.Grid) {
            $('#' + $.Setting.CounterName).text('');
            $('#' + $.Setting.CounterName).empty();
            $('#' + $.Setting.CounterName + ' input').val('');

            var members = [];
            $.each($.Setting.ColumnFilters, function (index, item) {
                item = '';
                members.push(index);
            });

            $.each(members, function (index, item) {
                $.Setting.ColumnFilters[item] = '';
            });

            $.Setting.Grid.invalidateAllRows();
            $('#' + $.Setting.GridContainer).empty();
        }

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    Instantiate: function () {
        // create a deferred object
        var def = $.Deferred();

        $.Setting.Data = [];
        $.Setting.ColumnFilters = {};
        $.Setting.DataView = new Slick.Data.DataView({
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
        for (var i = 0; i < $.Setting.Columns.length; i++) {
            switch ($.Setting.Columns[i]["id"]) {
                case 'Name':
                    $.Setting.Columns[i].header = {
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

    GetSettings: function () {
        // create a deferred object
        var def = $.Deferred();

        // We get our data from the server
        $.ajax({
            type: 'GET',
            url: '/Admin/GetSettings',
            data: {},
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    if (response.Settings.length == 0) {
                        // No data in report
                    } else {
                        for (var i = 0; i < response.Settings.length; i++) {
                            $.Setting.Data[i] = {
                                "id": response.Settings[i]["Id"],
                                "Name": response.Settings[i]["Name"],
                                "Value": response.Settings[i]["Value"]
                            };
                        }

                        $.Setting.DataView.setItems($.Setting.Data);

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
        var cookieCols = $.GUM.GetFromCookie($.Setting.CookieName);

        // We set the display columns to the manually defined columns
        $.Setting.DisplayColumns = $.Setting.Columns;

        if (cookieCols != null) {
            // Since the cookie exists we set the display columns to the JSON encoded column array in the cookie
            $.Setting.DisplayColumns = JSON.parse(cookieCols);

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
                for (k = 0; k < $.Setting.DisplayColumns.length; k++) {
                    if ($.Setting.DisplayColumns[k].id == columnData[i].Id) {
                        $.Setting.DisplayColumns[k][columnData[i].Action] = columnData[i].Data;
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
        //$.Setting.ColumnFilters = { Active: "true" };

        // We check the column filters and re-apply them and set the filter values into the text boxes
        $.each($.Setting.ColumnFilters, function (key, value) {
            $("[data-filterId='" + key + "']").val(value);
        })

        // Set the active filter and grid references
        $.CSF.globalColumnFilters = $.Setting.ColumnFilters;
        $.CSF.globalGridReference = $.Setting.Grid;
        $.Setting.DataView.refresh();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    InitializeGrid: function () {
        // create a deferred object
        var def = $.Deferred();

        $.Setting.Grid = new Slick.Grid("#" + $.Setting.GridContainer, $.Setting.DataView, $.Setting.DisplayColumns, $.Setting.GridOptions);

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
                    $.GUM.SaveToCookie($.Setting.CookieName, JSON.stringify($.Setting.Grid.getColumns()));
                    break;
                case 'Clear':
                    $.GUM.ClearFromCookie($.Setting.CookieName);
                    break;
                case 'Export':
                    $.GUM.ExportSlickGrid($.Setting.Grid, $.Setting.DataView);
                    break;
                default:
                    alert('Invalid menu command!');
            }
        });

        // register the header menu plugin
        $.Setting.Grid.registerPlugin(headerMenuPlugin);

        // Note that the columns are the manually defined columns, which is necessary for the column picker to have all columns in it, not just the ones saved in the cookie
        var activityColumnpicker = new Slick.Controls.ColumnPicker($.Setting.Columns, $.Setting.Grid, $.Setting.GridOptions);

        // register the group item metadata provider to add expand/collapse group handlers
        $.Setting.Grid.registerPlugin($.Setting.GroupItemMetadataProvider);

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    WireGridEvents: function () {
        // create a deferred object
        var def = $.Deferred();

        // Our scroll event
        $.Setting.Grid.onScroll.subscribe(function (e, args) {
            // Actions here
        });

        // Our sort function
        $.Setting.Grid.onSort.subscribe(function (e, args) {
            $.CSC.globalSortColumns = args.sortCols;
            $.Setting.DataView.sort($.CSC.globalMultiColumnComparer, args.sortAsc);
        });

        // Row count change event
        $.Setting.DataView.onRowCountChanged.subscribe(function (e, args) {
            $.Setting.Grid.updateRowCount();
            $.Setting.Grid.render();
            $.Setting.UpdateRecordCount();
        });

        // Row chnge event
        $.Setting.DataView.onRowsChanged.subscribe(function (e, args) {
            $.Setting.Grid.invalidateRows(args.rows);
            $.Setting.Grid.render();
        });

        // Delegate handler for the filters in the header row
        $($.Setting.Grid.getHeaderRow()).delegate(":input", "change keyup", function (e) {
            var columnId = $(this).data("columnId");
            if (columnId != null) {
                // We create a local copy of the filters and then assign the value to the global filters
                $.Setting.ColumnFilters[columnId] = $.trim($(this).val());
                $.CSF.globalColumnFilters = $.Setting.ColumnFilters;

                // We assign our grid to the global grid reference for the global search filter to use and then refresh the grid.  This allows multiple grids to use the same search filter
                $.CSF.globalGridReference = $.Setting.Grid;
                $.Setting.DataView.refresh();
                $.Setting.UpdateRecordCount();
            }
        });

        $.Setting.Grid.onHeaderRowCellRendered.subscribe(function (e, args) {
            $(args.node).empty();
            $("<input type='text'>")
               .data("columnId", args.column.id)
               .val($.CSF.globalColumnFilters[args.column.id])
                .attr("data-filterId", args.column.id)
               .appendTo(args.node);
        });

        $.Setting.DataView.setFilter($.CSF.globalFilter);
        $.Setting.Grid.init();

        $.Setting.UpdateRecordCount();
        $.Setting.ResizeGrid();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    UpdateRecordCount: function () {
        var negativeRows = $.Setting.DataView.getGroups().length * 2;
        $('#' + $.Setting.CounterName).text('| ' + Number($.Setting.DataView.getLength() - negativeRows) + ' Records');
    },

    ResizeGrid: function () {
        this.ResizeGridContainer();

        if ($.Setting.Grid) {
            $.Setting.Grid.resizeCanvas();
        }
    },

    ResizeGridContainer: function () {
        $('#' + $.Setting.GridContainer).height($(window).height() - 35);
    },

    Create: function () {
        $.ajax({
            type: 'POST',
            url: '/Setting/Create',
            data: { logon: $('#Logon').val(), firstName: $('#FirstName').val(), lastName: $("#LastName").val(), email: $("#Email").val(), active: $("#Active").val(), admin: $("#Admin").val() },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    $.Setting.DataView.addItem({
                        id: response.Setting.Id,
                        Logon: response.Setting.Logon,
                        FirstName: response.Setting.FirstName,
                        LastName: response.Setting.LastName,
                        Email: response.Setting.Email,
                        Active: response.Setting.Active,
                        Admin: response.Setting.Admin,
                    });

                    $('#Logon').val("");
                    $('#FirstName').val("");
                    $('#LastName').val("");
                    $('#Email').val("");
                    $('#Active').val("");
                    $('#Admin').val("");
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

    Update: function (id, value, editCommand) {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Updating');

        $.ajax({
            type: 'POST',
            url: '/Admin/UpdateSetting',
            data: { id: id, value: value },
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
        if (!confirm('Are you sure you want to permenantly and irrevocably delete this setting and all associated records?')) {
            return;
        }

        $.ajax({
            type: 'POST',
            url: '/Setting/Delete',
            data: { id: id },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    $.Setting.DataView.deleteItem(id);
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
    $.Setting.ResizeGrid();
});

$(window).load(function () {
    $.Setting.ResizeGridContainer();
    $.Setting.Driver();

    $('#ExportSettingGrid').click(function () {
        $.GUM.ExportSlickGrid($.Setting.Grid, $.Setting.DataView);
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
        $.Setting.Create();
    });
});