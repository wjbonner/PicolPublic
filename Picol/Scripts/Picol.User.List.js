$.UserHelper = {
    QueueAndExecuteCommand: function (item, column, editCommand) {
        if (column['id'] == 'Logon') {
            $.User.Update(item.id, editCommand.serializedValue, item.FirstName, item.LastName, item.Email, item.Verified, item.Active, item.Admin, item.LastLogin, editCommand);
        } else if (column['id'] == 'FirstName') {
            $.User.Update(item.id, item.Logon, editCommand.serializedValue, item.LastName, item.Email, item.Verified, item.Active, item.Admin, item.LastLogin, editCommand);
        } else if (column['id'] == 'LastName') {
            $.User.Update(item.id, item.Logon, item.FirstName, editCommand.serializedValue, item.Email, item.Verified, item.Active, item.Admin, item.LastLogin, editCommand);
        } else if (column['id'] == 'Email') {
            $.User.Update(item.id, item.Logon, item.FirstName, item.LastName, editCommand.serializedValue, item.Verified, item.Active, item.Admin, item.LastLogin, editCommand);
        } else if (column['id'] == 'Active') {
            $.User.Update(item.id, item.Logon, item.FirstName, item.LastName, item.Email, item.Verified, editCommand.serializedValue, item.Admin, item.LastLogin, editCommand);
        } else if (column['id'] == 'Admin') {
            $.User.Update(item.id, item.Logon, item.FirstName, item.LastName, item.Email, item.Verified, item.Active, editCommand.serializedValue, item.LastLogin, editCommand);
        } else {
            editCommand.execute();
            $('#OverlayDisplay').hide();
        }
    },

    ActionsFormatter: function (row, cell, value, columnDef, dataContext) {
        var details = "<a href='/User/Details/" + dataContext["id"] + "'>Details</a>";
        var del = "<a href='javascript:void(0)' onclick='$.User.Delete(" + dataContext["id"] + ")'>Delete</a>";
        var recovery = "<a href='javascript:void(0)' onclick='$.User.SendRecovery(" + dataContext["id"] + ")'>Recovery</a>";
        return details + " | " + del + " | " + recovery;
    }
}

$.User = {
    CookieName: "Picol.User.List.Grid",
    GridContainer: 'UserGrid',
    CounterName: 'UserCounter',
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
        { id: "Logon", name: "Logon", field: "Logon", sortable: true, editor: Slick.Editors.Text },
        { id: "FirstName", name: "FirstName", field: "FirstName", sortable: true, editor: Slick.Editors.Text },
        { id: "LastName", name: "LastName", field: "LastName", sortable: true, editor: Slick.Editors.Text },
        { id: "Email", name: "Email", field: "Email", sortable: true, editor: Slick.Editors.Text },
        { id: "PasswordLastSet", name: "PasswordLastSet", field: "PasswordLastSet", sortable: true },
        { id: "LastLogin", name: "LastLogin", field: "LastLogin", sortable: true },
        { id: "Active", name: "Active", field: "Active", sortable: true, formatter: Slick.Formatters.Checkmark, editor: Slick.Editors.Checkbox },
        { id: "Admin", name: "Admin", field: "Admin", sortable: true, formatter: Slick.Formatters.Checkmark, editor: Slick.Editors.Checkbox },
        { id: "Actions", name: "Actions", field: "Actions", sortable: true, formatter: $.UserHelper.ActionsFormatter }
    ],

    GridOptions: {
        enableCellNavigation: true,
        editable: true,
        forceFitColumns: true,
        editCommandHandler: $.UserHelper.QueueAndExecuteCommand,
        autoEdit: true,
        showHeaderRow: true,
        headerRowHeight: 40,
        explicitInitialization: true,
        multiColumnSort: true,
        enableTextSelectionOnCells: true
    },

    Driver: function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Retrieving Users');
        $.User.ResizeGridContainer();

        $.User.Clean()
            .done($.User.Instantiate)
            .done($.User.GetUsers)
            .done($.User.BuildMenu)
            .done($.User.ConfigureColumns)
            .done($.User.InitializeGrid)
            .done($.User.InitializeGridPlugins)
            .done($.User.WireGridEvents)
            .done($.User.ConfigureFilters);
    },

    Clean: function () {
        // create a deferred object
        var def = $.Deferred();

        if ($.User.Grid) {
            $('#' + $.User.CounterName).text('');
            $('#' + $.User.CounterName).empty();
            $('#' + $.User.CounterName + ' input').val('');

            var members = [];
            $.each($.User.ColumnFilters, function (index, item) {
                item = '';
                members.push(index);
            });

            $.each(members, function (index, item) {
                $.User.ColumnFilters[item] = '';
            });

            $.User.Grid.invalidateAllRows();
            $('#' + $.User.GridContainer).empty();
        }

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    Instantiate: function () {
        // create a deferred object
        var def = $.Deferred();

        $.User.Data = [];
        $.User.ColumnFilters = {};
        $.User.DataView = new Slick.Data.DataView({
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
        for (var i = 0; i < $.User.Columns.length; i++) {
            switch ($.User.Columns[i]["id"]) {
                case 'Name':
                    $.User.Columns[i].header = {
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

    GetUsers: function () {
        // create a deferred object
        var def = $.Deferred();

        // We get our data from the server
        $.ajax({
            type: 'GET',
            url: '/User/Get',
            data: {},
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    if (response.Users.length == 0) {
                        // No data in report
                    } else {
                        for (var i = 0; i < response.Users.length; i++) {
                            $.User.Data[i] = {
                                "id": response.Users[i]["Id"],
                                "Logon": response.Users[i]["Logon"],
                                "FirstName": response.Users[i]["FirstName"],
                                "LastName": response.Users[i]["LastName"],
                                "Email": response.Users[i]["Email"],
                                "PasswordLastSet": response.Users[i]["PasswordLastSet"],
                                "LastLogin": response.Users[i]["LastLogin"],
                                "Verified": response.Users[i]["Verified"],
                                "Active": response.Users[i]["Active"],
                                "Admin": response.Users[i]["Admin"],
                                "Actions": ""
                            };
                        }

                        $.User.DataView.setItems($.User.Data);

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
        var cookieCols = $.GUM.GetFromCookie($.User.CookieName);

        // We set the display columns to the manually defined columns
        $.User.DisplayColumns = $.User.Columns;

        if (cookieCols != null) {
            // Since the cookie exists we set the display columns to the JSON encoded column array in the cookie
            $.User.DisplayColumns = JSON.parse(cookieCols);

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
                for (k = 0; k < $.User.DisplayColumns.length; k++) {
                    if ($.User.DisplayColumns[k].id == columnData[i].Id) {
                        $.User.DisplayColumns[k][columnData[i].Action] = columnData[i].Data;
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
        //$.User.ColumnFilters = { Active: "true" };

        // We check the column filters and re-apply them and set the filter values into the text boxes
        $.each($.User.ColumnFilters, function (key, value) {
            $("[data-filterId='" + key + "']").val(value);
        })

        // Set the active filter and grid references
        $.CSF.globalColumnFilters = $.User.ColumnFilters;
        $.CSF.globalGridReference = $.User.Grid;
        $.User.DataView.refresh();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    InitializeGrid: function () {
        // create a deferred object
        var def = $.Deferred();

        $.User.Grid = new Slick.Grid("#" + $.User.GridContainer, $.User.DataView, $.User.DisplayColumns, $.User.GridOptions);

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
                    $.GUM.SaveToCookie($.User.CookieName, JSON.stringify($.User.Grid.getColumns()));
                    break;
                case 'Clear':
                    $.GUM.ClearFromCookie($.User.CookieName);
                    break;
                case 'Export':
                    $.GUM.ExportSlickGrid($.User.Grid, $.User.DataView);
                    break;
                default:
                    alert('Invalid menu command!');
            }
        });

        // register the header menu plugin
        $.User.Grid.registerPlugin(headerMenuPlugin);

        // Note that the columns are the manually defined columns, which is necessary for the column picker to have all columns in it, not just the ones saved in the cookie
        var activityColumnpicker = new Slick.Controls.ColumnPicker($.User.Columns, $.User.Grid, $.User.GridOptions);

        // register the group item metadata provider to add expand/collapse group handlers
        $.User.Grid.registerPlugin($.User.GroupItemMetadataProvider);

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    WireGridEvents: function () {
        // create a deferred object
        var def = $.Deferred();

        // Our scroll event
        $.User.Grid.onScroll.subscribe(function (e, args) {
            // Actions here
        });

        // Our sort function
        $.User.Grid.onSort.subscribe(function (e, args) {
            $.CSC.globalSortColumns = args.sortCols;
            $.User.DataView.sort($.CSC.globalMultiColumnComparer, args.sortAsc);
        });

        // Row count change event
        $.User.DataView.onRowCountChanged.subscribe(function (e, args) {
            $.User.Grid.updateRowCount();
            $.User.Grid.render();
            $.User.UpdateRecordCount();
        });

        // Row chnge event
        $.User.DataView.onRowsChanged.subscribe(function (e, args) {
            $.User.Grid.invalidateRows(args.rows);
            $.User.Grid.render();
        });

        // Delegate handler for the filters in the header row
        $($.User.Grid.getHeaderRow()).delegate(":input", "change keyup", function (e) {
            var columnId = $(this).data("columnId");
            if (columnId != null) {
                // We create a local copy of the filters and then assign the value to the global filters
                $.User.ColumnFilters[columnId] = $.trim($(this).val());
                $.CSF.globalColumnFilters = $.User.ColumnFilters;

                // We assign our grid to the global grid reference for the global search filter to use and then refresh the grid.  This allows multiple grids to use the same search filter
                $.CSF.globalGridReference = $.User.Grid;
                $.User.DataView.refresh();
                $.User.UpdateRecordCount();
            }
        });

        $.User.Grid.onHeaderRowCellRendered.subscribe(function (e, args) {
            $(args.node).empty();
            $("<input type='text'>")
               .data("columnId", args.column.id)
               .val($.CSF.globalColumnFilters[args.column.id])
                .attr("data-filterId", args.column.id)
               .appendTo(args.node);
        });

        $.User.DataView.setFilter($.CSF.globalFilter);
        $.User.Grid.init();

        $.User.UpdateRecordCount();
        $.User.ResizeGrid();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    UpdateRecordCount: function () {
        var negativeRows = $.User.DataView.getGroups().length * 2;
        $('#' + $.User.CounterName).text('| ' + Number($.User.DataView.getLength() - negativeRows) + ' Records');
    },

    ResizeGrid: function () {
        this.ResizeGridContainer();

        if ($.User.Grid) {
            $.User.Grid.resizeCanvas();
        }
    },

    ResizeGridContainer: function () {
        $('#' + $.User.GridContainer).height($(window).height() - 35);
    },

    Create: function () {
        $.ajax({
            type: 'POST',
            url: '/User/Create',
            data: { logon: $('#Logon').val(), firstName: $('#FirstName').val(), lastName: $("#LastName").val(), email: $("#Email").val(), active: $("#Active").val(), admin: $("#Admin").val() },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    $.User.DataView.addItem({
                        id: response.User.Id,
                        Logon: response.User.Logon,
                        FirstName: response.User.FirstName,
                        LastName: response.User.LastName,
                        Email: response.User.Email,
                        Active: response.User.Active,
                        Admin: response.User.Admin,
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

    Update: function (id, logon, firstName, lastName, email, verified, active, admin, lastLogin, editCommand) {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Updating');

        $.ajax({
            type: 'POST',
            url: '/User/Update',
            data: { id: id, logon: logon, firstName: firstName, lastName: lastName, email: email, verified: verified, active: active, admin: admin, LastLogin: lastLogin },
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
        if (!confirm('Are you sure you want to permenantly and irrevocably delete this user and all associated records?')) {
            return;
        }

        $.ajax({
            type: 'POST',
            url: '/User/Delete',
            data: { id: id },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    $.User.DataView.deleteItem(id);
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

    SendRecovery: function (id) {
        if (!confirm('Are you sure you want to send a password recovery email to this user?')) {
            return;
        }

        // We get our data from the server
        $.ajax({
            type: 'GET',
            url: '/User/SendRecoveryEmail',
            data: {id: id},
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    alert("Recovery email sent!");
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
}

function DisplayDetails(id) {
    $('#Overlay').show();
    $('#Details').show();
}

$(window).resize(function () {
    $.User.ResizeGrid();
});

$(window).load(function () {
    $.User.ResizeGridContainer();
    $.User.Driver();

    $('#ExportUserGrid').click(function () {
        $.GUM.ExportSlickGrid($.User.Grid, $.User.DataView);
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
        $.User.Create();
    });
});