$.LabelHelper = {
    QueueAndExecuteCommand: function (item, column, editCommand) {
        if (column['id'] == 'Name') {
            $.Label.Update(item.id, editCommand.serializedValue, item.FormulationId, item.IntendedUserId, item.RegistrantId, item.SignalWordId, item.UsageId, editCommand);
        } else {
            editCommand.execute();
            $('#OverlayDisplay').hide();
        }
    },

    ActionsFormatter: function (row, cell, value, columnDef, dataContext) {
        //var details = "<a target='_blank' href='/Label/Details/" + dataContext["id"] + "'>Details</a>";
        //var del = "<a href='javascript:void(0)' onclick='$.Label.Delete(" + dataContext["id"] + ")'>Delete</a>";
        var review = "<a href='/CertificateProcessing/Review?code=" + dataContext["Code"] + "' target='_blank'>Review</a>";

        return dataContext["Match"] ? review : "";
    }
}

$.Label = {
    CookieName: "Picol.Label.List.Grid",
    GridContainer: 'LabelGrid',
    CounterName: 'LabelCounter',
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
        { id: "Reregister", name: "Reregister", field: "Reregister", sortable: true, formatter: Slick.Formatters.Checkmark, editor: Slick.Editors.Checkbox },
        { id: "Actions", name: "Actions", field: "Actions", sortable: true, formatter: $.LabelHelper.ActionsFormatter }
    ],

    GridOptions: {
        enableCellNavigation: true,
        editable: true,
        forceFitColumns: true,
        editCommandHandler: $.LabelHelper.QueueAndExecuteCommand,
        autoEdit: true,
        showHeaderRow: true,
        headerRowHeight: 40,
        explicitInitialization: true,
        multiColumnSort: true,
        enableTextSelectionOnCells: true
    },

    Driver: function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Retrieving Labels');
        $.Label.ResizeGridContainer();

        $.Label.Clean()
            .done($.Label.Instantiate)
            .done($.Label.GetLabels)
            .done($.Label.BuildMenu)
            .done($.Label.ConfigureColumns)
            .done($.Label.InitializeGrid)
            .done($.Label.InitializeGridPlugins)
            .done($.Label.WireGridEvents)
            .done($.Label.ConfigureFilters);
    },

    Clean: function () {
        // create a deferred object
        var def = $.Deferred();

        if ($.Label.Grid) {
            $('#' + $.Label.CounterName).text('');
            $('#' + $.Label.CounterName).empty();
            $('#' + $.Label.CounterName + ' input').val('');

            var members = [];
            $.each($.Label.ColumnFilters, function (index, item) {
                item = '';
                members.push(index);
            });

            $.each(members, function (index, item) {
                $.Label.ColumnFilters[item] = '';
            });

            $.Label.Grid.invalidateAllRows();
            $('#' + $.Label.GridContainer).empty();
        }

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    Instantiate: function () {
        // create a deferred object
        var def = $.Deferred();

        $.Label.Data = [];
        $.Label.ColumnFilters = {};
        $.Label.DataView = new Slick.Data.DataView({
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
        for (var i = 0; i < $.Label.Columns.length; i++) {
            switch ($.Label.Columns[i]["id"]) {
                case 'Name':
                    $.Label.Columns[i].header = {
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

    GetLabels: function () {
        // create a deferred object
        var def = $.Deferred();

        // We get our data from the server
        $.ajax({
            type: 'GET',
            url: '/CertificateProcessing/GetLabelsByRegistrant',
            data: { code: $.GUM.QueryString["Code"] },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    if (response.Labels.length == 0) {
                        $("#LabelsContainer").hide();
                        $("#UnprocessedLabels").text("No");
                    } else {
                        for (var i = 0; i < response.Labels.length; i++) {
                            $.Label.Data[i] = {
                                "id": response.Labels[i]["Id"],
                                "Name": response.Labels[i]["Name"],
                                "Actions": ""
                            };
                        }

                        $.Label.DataView.setItems($.Label.Data);

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
        var cookieCols = $.GUM.GetFromCookie($.Label.CookieName);

        // We set the display columns to the manually defined columns
        $.Label.DisplayColumns = $.Label.Columns;

        if (cookieCols != null) {
            // Since the cookie exists we set the display columns to the JSON encoded column array in the cookie
            $.Label.DisplayColumns = JSON.parse(cookieCols);

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
                for (k = 0; k < $.Label.DisplayColumns.length; k++) {
                    if ($.Label.DisplayColumns[k].id == columnData[i].Id) {
                        $.Label.DisplayColumns[k][columnData[i].Action] = columnData[i].Data;
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
        //$.Label.ColumnFilters = { Active: "true" };

        // We check the column filters and re-apply them and set the filter values into the text boxes
        $.each($.Label.ColumnFilters, function (key, value) {
            $("[data-filterId='" + key + "']").val(value);
        })

        // Set the active filter and grid references
        $.CSF.globalColumnFilters = $.Label.ColumnFilters;
        $.CSF.globalGridReference = $.Label.Grid;
        $.Label.DataView.refresh();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    InitializeGrid: function () {
        // create a deferred object
        var def = $.Deferred();

        $.Label.Grid = new Slick.Grid("#" + $.Label.GridContainer, $.Label.DataView, $.Label.DisplayColumns, $.Label.GridOptions);

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
                    $.GUM.SaveToCookie($.Label.CookieName, JSON.stringify($.Label.Grid.getColumns()));
                    break;
                case 'Clear':
                    $.GUM.ClearFromCookie($.Label.CookieName);
                    break;
                case 'Export':
                    $.GUM.ExportSlickGrid($.Label.Grid, $.Label.DataView);
                    break;
                default:
                    alert('Invalid menu command!');
            }
        });

        // register the header menu plugin
        $.Label.Grid.registerPlugin(headerMenuPlugin);

        // Note that the columns are the manually defined columns, which is necessary for the column picker to have all columns in it, not just the ones saved in the cookie
        var activityColumnpicker = new Slick.Controls.ColumnPicker($.Label.Columns, $.Label.Grid, $.Label.GridOptions);

        // register the group item metadata provider to add expand/collapse group handlers
        $.Label.Grid.registerPlugin($.Label.GroupItemMetadataProvider);

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    WireGridEvents: function () {
        // create a deferred object
        var def = $.Deferred();

        // Our scroll event
        $.Label.Grid.onScroll.subscribe(function (e, args) {
            // Actions here
        });

        // Our sort function
        $.Label.Grid.onSort.subscribe(function (e, args) {
            $.CSC.globalSortColumns = args.sortCols;
            $.Label.DataView.sort($.CSC.globalMultiColumnComparer, args.sortAsc);
        });

        // Row count change event
        $.Label.DataView.onRowCountChanged.subscribe(function (e, args) {
            $.Label.Grid.updateRowCount();
            $.Label.Grid.render();
            $.Label.UpdateRecordCount();
        });

        // Row chnge event
        $.Label.DataView.onRowsChanged.subscribe(function (e, args) {
            $.Label.Grid.invalidateRows(args.rows);
            $.Label.Grid.render();
        });

        // Delegate handler for the filters in the header row
        $($.Label.Grid.getHeaderRow()).delegate(":input", "change keyup", function (e) {
            var columnId = $(this).data("columnId");
            if (columnId != null) {
                // We create a local copy of the filters and then assign the value to the global filters
                $.Label.ColumnFilters[columnId] = $.trim($(this).val());
                $.CSF.globalColumnFilters = $.Label.ColumnFilters;

                // We assign our grid to the global grid reference for the global search filter to use and then refresh the grid.  This allows multiple grids to use the same search filter
                $.CSF.globalGridReference = $.Label.Grid;
                $.Label.DataView.refresh();
                $.Label.UpdateRecordCount();
            }
        });

        $.Label.Grid.onHeaderRowCellRendered.subscribe(function (e, args) {
            $(args.node).empty();
            $("<input type='text'>")
               .data("columnId", args.column.id)
               .val($.CSF.globalColumnFilters[args.column.id])
                .attr("data-filterId", args.column.id)
               .appendTo(args.node);
        });

        $.Label.DataView.setFilter($.CSF.globalFilter);
        $.Label.Grid.init();

        $.Label.UpdateRecordCount();
        $.Label.ResizeGrid();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    UpdateRecordCount: function () {
        var negativeRows = $.Label.DataView.getGroups().length * 2;
        $('#' + $.Label.CounterName).text('| ' + Number($.Label.DataView.getLength() - negativeRows) + ' Records');
    },

    ResizeGrid: function () {
        $.Label.ResizeGridContainer();

        if ($.Label.Grid) {
            $.Label.Grid.resizeCanvas();
        }
    },

    ResizeGridContainer: function () {
        $('#' + $.Label.GridContainer).height($(window).height() - $("#ProductsContainer").height() - $("#RegistrantContainer").height() - 35);
    },

    Create: function () {
        $.ajax({
            type: 'POST',
            url: '/CertificateProcessing/Create',
            data: { Name: $('#Name').val(), FormulationId: $('#FormulationId').val(), IntendedUserId: $("#IntendedUserId").val(), RegistrantId: $("#RegistrantId").val(), SignalWordId: $("#SignalWordId").val(), UsageId: $("#UsageId").val() },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    $.Label.DataView.addItem({
                        id: response.Label.Id,
                        Name: response.Label.Name,
                        Formulation: $('#FormulationId option:selected').text(),
                        FormulationId: response.Label.FormulationId,
                        IntendedUser: $('#IntendedUserId option:selected').text(),
                        IntendedUserId: response.Label.IntendedUserId,
                        Registrant: $('#RegistrantId option:selected').text(),
                        RegistrantId: response.Label.RegistrantId,
                        SignalWord: $('#SignalWordId option:selected').text(),
                        SignalWordId: response.Label.SignalWordId,
                        Usage: $('#UsageId option:selected').text(),
                        UsageId: response.Label.UsageId,
                    });

                    $('#Name').val("");
                    $('#FormulationId').val("");
                    $('#IntendedUserId').val("");
                    $('#RegistrantId').val("");
                    $('#SignalWordId').val("");
                    $('#UsageId').val("");
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
            url: '/CertificateProcessing/Update',
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
        if (!confirm('Are you sure you want to permenantly and irrevocably delete this label and all associated records?')) {
            return;
        }

        $.ajax({
            type: 'POST',
            url: '/CertificateProcessing/Delete',
            data: { id: id },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    $.Label.DataView.deleteItem(id);
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

$.ProductHelper = {
    QueueAndExecuteCommand: function (item, column, editCommand) {
        if (column['id'] == 'Name') {
            $.Product.Update(item.id, editCommand.serializedValue, item.FormulationId, item.IntendedUserId, item.RegistrantId, item.SignalWordId, item.UsageId, editCommand);
        } else {
            editCommand.execute();
            $('#OverlayDisplay').hide();
        }
    },

    ActionsFormatter: function (row, cell, value, columnDef, dataContext) {
        //var details = "<a target='_blank' href='/Product/Details/" + dataContext["id"] + "'>Details</a>";
        //var del = "<a href='javascript:void(0)' onclick='$.Product.Delete(" + dataContext["id"] + ")'>Delete</a>";
        var review = "<a href='/CertificateProcessing/Review?code=" + dataContext["Code"] + "' target='_blank'>Review</a>";

        return dataContext["Match"] ? review : "";
    }
}

$.Product = {
    CookieName: "Picol.Product.List.Grid",
    GridContainer: 'ProductGrid',
    CounterName: 'ProductCounter',
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
        { id: "EpaNumber", name: "EpaNumber", field: "EpaNumber", sortable: true },
        { id: "SupplementalName", name: "SupplementalName", field: "SupplementalName", sortable: true },
        { id: "SupplementalNumber", name: "SupplementalNumber", field: "SupplementalNumber", sortable: true },
        { id: "Year", name: "Year", field: "Year", sortable: true },
        { id: "Revised", name: "Revised", field: "Revised", sortable: true, formatter: Slick.Formatters.Checkmark },
        { id: "Cancelled", name: "Cancelled", field: "Cancelled", sortable: true, formatter: Slick.Formatters.Checkmark },
        { id: "Reregister", name: "Reregister", field: "Reregister", sortable: true, formatter: Slick.Formatters.Checkmark, editor: Slick.Editors.Checkbox },
    ],

    GridOptions: {
        enableCellNavigation: true,
        editable: true,
        forceFitColumns: true,
        editCommandHandler: $.ProductHelper.QueueAndExecuteCommand,
        autoEdit: true,
        showHeaderRow: true,
        headerRowHeight: 40,
        explicitInitialization: true,
        multiColumnSort: true,
        enableTextSelectionOnCells: true
    },

    Driver: function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Retrieving Products');
        $.Product.ResizeGridContainer();

        $.Product.Clean()
            .done($.Product.Instantiate)
            .done($.Product.GetProducts)
            .done($.Product.BuildMenu)
            .done($.Product.ConfigureColumns)
            .done($.Product.InitializeGrid)
            .done($.Product.InitializeGridPlugins)
            .done($.Product.WireGridEvents)
            .done($.Product.ConfigureFilters);
    },

    Clean: function () {
        // create a deferred object
        var def = $.Deferred();

        if ($.Product.Grid) {
            $('#' + $.Product.CounterName).text('');
            $('#' + $.Product.CounterName).empty();
            $('#' + $.Product.CounterName + ' input').val('');

            var members = [];
            $.each($.Product.ColumnFilters, function (index, item) {
                item = '';
                members.push(index);
            });

            $.each(members, function (index, item) {
                $.Product.ColumnFilters[item] = '';
            });

            $.Product.Grid.invalidateAllRows();
            $('#' + $.Product.GridContainer).empty();
        }

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    Instantiate: function () {
        // create a deferred object
        var def = $.Deferred();

        $.Product.Data = [];
        $.Product.ColumnFilters = {};
        $.Product.DataView = new Slick.Data.DataView({
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
        for (var i = 0; i < $.Product.Columns.length; i++) {
            switch ($.Product.Columns[i]["id"]) {
                case 'Name':
                    $.Product.Columns[i].header = {
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

    GetProducts: function () {
        // create a deferred object
        var def = $.Deferred();

        // We get our data from the server
        $.ajax({
            type: 'GET',
            url: '/CertificateProcessing/GetProductsByRegistrant',
            data: { code: $.GUM.QueryString["Code"], fileName: $.GUM.QueryString["FileName"], fileId: $('#FileId').val() },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    if (response.Products.length == 0) {
                        // No data in report
                    } else {
                        $('#NewLabels').text(response.NewLabels);
                        $('#RevCan').text(response.Revisions + '/' + response.Cancellations);

                        for (var i = 0; i < response.Products.length; i++) {
                            $.Product.Data[i] = {
                                "id": response.Products[i]["Id"],
                                "Name": response.Products[i]["Name"],
                                "EpaNumber": response.Products[i]["EpaNumber"],
                                "SupplementalName": response.Products[i]["SupplementalName"],
                                "SupplementalNumber": response.Products[i]["SupplementalNumber"],
                                "Year": response.Products[i]["Year"],
                                "Revised": response.Products[i]["Revised"],
                                "Cancelled": response.Products[i]["Cancelled"],
                                "Reregister": response.Products[i]["Reregister"]
                            };
                        }

                        $.Product.DataView.setItems($.Product.Data);

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
        var cookieCols = $.GUM.GetFromCookie($.Product.CookieName);

        // We set the display columns to the manually defined columns
        $.Product.DisplayColumns = $.Product.Columns;

        if (cookieCols != null) {
            // Since the cookie exists we set the display columns to the JSON encoded column array in the cookie
            $.Product.DisplayColumns = JSON.parse(cookieCols);

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
                for (k = 0; k < $.Product.DisplayColumns.length; k++) {
                    if ($.Product.DisplayColumns[k].id == columnData[i].Id) {
                        $.Product.DisplayColumns[k][columnData[i].Action] = columnData[i].Data;
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
        //$.Product.ColumnFilters = { Active: "true" };

        // We check the column filters and re-apply them and set the filter values into the text boxes
        $.each($.Product.ColumnFilters, function (key, value) {
            $("[data-filterId='" + key + "']").val(value);
        })

        // Set the active filter and grid references
        $.CSF.globalColumnFilters = $.Product.ColumnFilters;
        $.CSF.globalGridReference = $.Product.Grid;
        $.Product.DataView.refresh();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    InitializeGrid: function () {
        // create a deferred object
        var def = $.Deferred();

        $.Product.Grid = new Slick.Grid("#" + $.Product.GridContainer, $.Product.DataView, $.Product.DisplayColumns, $.Product.GridOptions);

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
                    $.GUM.SaveToCookie($.Product.CookieName, JSON.stringify($.Product.Grid.getColumns()));
                    break;
                case 'Clear':
                    $.GUM.ClearFromCookie($.Product.CookieName);
                    break;
                case 'Export':
                    $.GUM.ExportSlickGrid($.Product.Grid, $.Product.DataView);
                    break;
                default:
                    alert('Invalid menu command!');
            }
        });

        // register the header menu plugin
        $.Product.Grid.registerPlugin(headerMenuPlugin);

        // Note that the columns are the manually defined columns, which is necessary for the column picker to have all columns in it, not just the ones saved in the cookie
        var activityColumnpicker = new Slick.Controls.ColumnPicker($.Product.Columns, $.Product.Grid, $.Product.GridOptions);

        // register the group item metadata provider to add expand/collapse group handlers
        $.Product.Grid.registerPlugin($.Product.GroupItemMetadataProvider);

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    WireGridEvents: function () {
        // create a deferred object
        var def = $.Deferred();

        // Our scroll event
        $.Product.Grid.onScroll.subscribe(function (e, args) {
            // Actions here
        });

        // Our sort function
        $.Product.Grid.onSort.subscribe(function (e, args) {
            $.CSC.globalSortColumns = args.sortCols;
            $.Product.DataView.sort($.CSC.globalMultiColumnComparer, args.sortAsc);
        });

        // Row count change event
        $.Product.DataView.onRowCountChanged.subscribe(function (e, args) {
            $.Product.Grid.updateRowCount();
            $.Product.Grid.render();
            $.Product.UpdateRecordCount();
        });

        // Row chnge event
        $.Product.DataView.onRowsChanged.subscribe(function (e, args) {
            $.Product.Grid.invalidateRows(args.rows);
            $.Product.Grid.render();
        });

        // Delegate handler for the filters in the header row
        $($.Product.Grid.getHeaderRow()).delegate(":input", "change keyup", function (e) {
            var columnId = $(this).data("columnId");
            if (columnId != null) {
                // We create a local copy of the filters and then assign the value to the global filters
                $.Product.ColumnFilters[columnId] = $.trim($(this).val());
                $.CSF.globalColumnFilters = $.Product.ColumnFilters;

                // We assign our grid to the global grid reference for the global search filter to use and then refresh the grid.  This allows multiple grids to use the same search filter
                $.CSF.globalGridReference = $.Product.Grid;
                $.Product.DataView.refresh();
                $.Product.UpdateRecordCount();
            }
        });

        $.Product.Grid.onHeaderRowCellRendered.subscribe(function (e, args) {
            $(args.node).empty();
            $("<input type='text'>")
               .data("columnId", args.column.id)
               .val($.CSF.globalColumnFilters[args.column.id])
                .attr("data-filterId", args.column.id)
               .appendTo(args.node);
        });

        $.Product.DataView.setFilter($.CSF.globalFilter);
        $.Product.Grid.init();

        $.Product.UpdateRecordCount();
        $.Product.ResizeGrid();

        // Code to add highlighting
        $.Product.DataView.getItemMetadata = metadata($.Product.DataView.getItemMetadata);
        function metadata(old_metadata) {
            return function (row) {
                var item = this.getItem(row);
                var meta = old_metadata(row) || {};

                if (item) {
                    meta.cssClasses = meta.cssClasses || '';

                    if (item.Cancelled) {
                        meta.cssClasses += ' slickGridRowHighlight';
                    }
                }

                return meta;
            }
        }

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    UpdateRecordCount: function () {
        var negativeRows = $.Product.DataView.getGroups().length * 2;
        $('#' + $.Product.CounterName).text('| ' + Number($.Product.DataView.getLength() - negativeRows) + ' Records');
    },

    ResizeGrid: function () {
        $.Product.ResizeGridContainer();

        if ($.Product.Grid) {
            $.Product.Grid.resizeCanvas();
        }
    },

    ResizeGridContainer: function () {
        $('#' + $.Product.GridContainer).height($(window).height() - $("#LabelsContainer").height() - $("#RegistrantContainer").height() - 35);
    },

    Create: function () {
        $.ajax({
            type: 'POST',
            url: '/CertificateProcessing/Create',
            data: { Name: $('#Name').val(), FormulationId: $('#FormulationId').val(), IntendedUserId: $("#IntendedUserId").val(), RegistrantId: $("#RegistrantId").val(), SignalWordId: $("#SignalWordId").val(), UsageId: $("#UsageId").val() },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    $.Product.DataView.addItem({
                        id: response.Product.Id,
                        Name: response.Product.Name,
                        Formulation: $('#FormulationId option:selected').text(),
                        FormulationId: response.Product.FormulationId,
                        IntendedUser: $('#IntendedUserId option:selected').text(),
                        IntendedUserId: response.Product.IntendedUserId,
                        Registrant: $('#RegistrantId option:selected').text(),
                        RegistrantId: response.Product.RegistrantId,
                        SignalWord: $('#SignalWordId option:selected').text(),
                        SignalWordId: response.Product.SignalWordId,
                        Usage: $('#UsageId option:selected').text(),
                        UsageId: response.Product.UsageId,
                    });

                    $('#Name').val("");
                    $('#FormulationId').val("");
                    $('#IntendedUserId').val("");
                    $('#RegistrantId').val("");
                    $('#SignalWordId').val("");
                    $('#UsageId').val("");
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
            url: '/CertificateProcessing/Update',
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
        if (!confirm('Are you sure you want to permenantly and irrevocably delete this product and all associated records?')) {
            return;
        }

        $.ajax({
            type: 'POST',
            url: '/CertificateProcessing/Delete',
            data: { id: id },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    $.Product.DataView.deleteItem(id);
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
    $.Label.ResizeGrid();
});

$(window).load(function () {
    $.Label.ResizeGridContainer();
    $.Label.Driver();

    $.Product.ResizeGridContainer();
    $.Product.Driver();

    $('#ExportLabelGrid').click(function () {
        $.GUM.ExportSlickGrid($.Label.Grid, $.Label.DataView);
    });

    $('#OpenCreateWindow').click(function () {
        $('#CreateWindow').show();
        $('#Overlay').show();
    });

    $('#Overlay').click(function () {
        $('#CreateWindow').hide();
        $('#Overlay').hide();
        $('#CustomStampWindow').hide();
    });

    $('#Create').click(function () {
        $('#CreateWindow').hide();
        $('#Overlay').hide();
        $.Label.Create();
    });

    $('#Upload').change(function (object, index) {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Uploading...');

        var fd = new FormData();
        fd.append('fileId', $("#FileId").val());
        fd.append('fileData', this.files[0]);

        $.ajax({
            type: 'POST',
            url: '/CertificateProcessing/ReplaceFile',
            data: fd,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (data) {
                if (data.Error) {
                    alert(data.ErrorMessage);
                }
                else {
                    $('#OverlayMessage').text('Success');
                    $('#OverlayDisplay').hide();
                    $('#Upload').val("");
                }
            },
            error: function (data) {
                alert('An error has occurred communicating with the server!');
            },
            complete: function (req, status) {
                if (status != 'success') {
                    $('#OverlayDisplay').hide();
                }
            }
        });
    });

    $('#ReviewedStamp').click(function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Stamping...');

        $.ajax({
            type: 'POST',
            url: '/CertificateProcessing/StampFile',
            data: { fileId: $('#FileId').val(), message: "Reviewed by ", state: "reviewed" },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                }
            },
            error: function (response) {
                alert('An error has occurred communicating with the server!');
            },
            complete: function (response) {
                $('#OverlayDisplay').hide();
            }
        });
    });

    $('#TransitStamp').click(function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Stamping...');

        $.ajax({
            type: 'POST',
            url: '/CertificateProcessing/StampFile',
            data: { fileId: $('#FileId').val(), message: "In transit - ", state: "transit" },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                }
            },
            error: function (response) {
                alert('An error has occurred communicating with the server!');
            },
            complete: function (response) {
                $('#OverlayDisplay').hide();
            }
        });
    });

    $('#CustomStamp').click(function () {
        $('#CustomStampWindow').show();
        $('#Overlay').show();
    });


    $('#SubmitCustomStamp').click(function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Stamping...');

        $.ajax({
            type: 'POST',
            url: '/CertificateProcessing/StampFile',
            data: { fileId: $('#FileId').val(), message: $("#CustomStampText").val() + " ", state: "custom" },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    $("#CustomStampText").val("");
                    $('#CustomStampWindow').hide();
                    $('#Overlay').hide();
                }
            },
            error: function (response) {
                alert('An error has occurred communicating with the server!');
            },
            complete: function (response) {
                $('#OverlayDisplay').hide();
            }
        });
    });

    $('#RegisterLabels').click(function () {
        $('#RegistrationWindow').show();
        $('#Overlay').show();
    });


    $('#SubmitRegistration').click(function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Registering...');
        $('#RegistrationWindow').hide();
        $('#Overlay').hide();

        var rows = $.Product.DataView.getItems();
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].Reregister == true) {
                
                $.ajax({
                    type: 'POST',
                    url: '/CertificateProcessing/RegisterLabel',
                    data: { id: rows[i].id, state: $("#States").val(), year: $("#Years").val() },
                    dataType: "json",
                    success: function (response) {
                        if (response.Error) {
                            alert(response.ErrorMessage);
                        }
                        else {

                        }
                    },
                    error: function (response) {
                        //alert('An error has occurred communicating with the server!');
                    },
                    complete: function (response) {
                    }
                });
            }
        }

        $('#OverlayDisplay').hide();
    });

    function RegisterLabel (id, name)
    {
        
    }
});