$.FileHelper = {
    QueueAndExecuteCommand: function (item, column, editCommand) {
        if (column['id'] == 'Name') {
            $.File.Update(item.id, editCommand.serializedValue, item.FormulationId, item.IntendedUserId, item.RegistrantId, item.SignalWordId, item.UsageId, editCommand);
        } else {
            editCommand.execute();
            $('#OverlayDisplay').hide();
        }
    },

    ActionsFormatter: function (row, cell, value, columnDef, dataContext) {
        //var details = "<a target='_blank' href='/File/Details/" + dataContext["id"] + "'>Details</a>";
        //var del = "<a href='javascript:void(0)' onclick='$.File.Delete(" + dataContext["id"] + ")'>Delete</a>";
        var review = "<a href='/CertificateProcessing/Review?code=" + dataContext["Code"] + "' target='_blank'>Review</a>";

        return dataContext["Match"] ? review : "";
    }
}

$.File = {
    CookieName: "Picol.File.List.Grid",
    GridContainer: 'FileGrid',
    CounterName: 'FileCounter',
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
        { id: "Actions", name: "Actions", field: "Actions", sortable: true, formatter: $.FileHelper.ActionsFormatter }
    ],

    GridOptions: {
        enableCellNavigation: true,
        editable: true,
        forceFitColumns: true,
        editCommandHandler: $.FileHelper.QueueAndExecuteCommand,
        autoEdit: true,
        showHeaderRow: true,
        headerRowHeight: 40,
        explicitInitialization: true,
        multiColumnSort: true,
        enableTextSelectionOnCells: true
    },

    Driver: function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Retrieving Files');
        $.File.ResizeGridContainer();

        $.File.Clean()
            .done($.File.Instantiate)
            .done($.File.GetFiles)
            .done($.File.BuildMenu)
            .done($.File.ConfigureColumns)
            .done($.File.InitializeGrid)
            .done($.File.InitializeGridPlugins)
            .done($.File.WireGridEvents)
            .done($.File.ConfigureFilters);
    },

    Clean: function () {
        // create a deferred object
        var def = $.Deferred();

        if ($.File.Grid) {
            $('#' + $.File.CounterName).text('');
            $('#' + $.File.CounterName).empty();
            $('#' + $.File.CounterName + ' input').val('');

            var members = [];
            $.each($.File.ColumnFilters, function (index, item) {
                item = '';
                members.push(index);
            });

            $.each(members, function (index, item) {
                $.File.ColumnFilters[item] = '';
            });

            $.File.Grid.invalidateAllRows();
            $('#' + $.File.GridContainer).empty();
        }

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    Instantiate: function () {
        // create a deferred object
        var def = $.Deferred();

        $.File.Data = [];
        $.File.ColumnFilters = {};
        $.File.DataView = new Slick.Data.DataView({
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
        for (var i = 0; i < $.File.Columns.length; i++) {
            switch ($.File.Columns[i]["id"]) {
                case 'Name':
                    $.File.Columns[i].header = {
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

    GetFiles: function () {
        // create a deferred object
        var def = $.Deferred();

        // We get our data from the server
        $.ajax({
            type: 'GET',
            url: '/CertificateProcessing/GetInTransit',
            data: { code: $.GUM.QueryString["Code"] },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    if (response.Files.length == 0) {
                    } else {
                        for (var i = 0; i < response.Files.length; i++) {
                            $.File.Data[i] = {
                                "id": response.Files[i]["Id"],
                                "Name": response.Files[i]["Name"],
                                "Actions": ""
                            };
                        }

                        $.File.DataView.setItems($.File.Data);

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
        var cookieCols = $.GUM.GetFromCookie($.File.CookieName);

        // We set the display columns to the manually defined columns
        $.File.DisplayColumns = $.File.Columns;

        if (cookieCols != null) {
            // Since the cookie exists we set the display columns to the JSON encoded column array in the cookie
            $.File.DisplayColumns = JSON.parse(cookieCols);

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
                for (k = 0; k < $.File.DisplayColumns.length; k++) {
                    if ($.File.DisplayColumns[k].id == columnData[i].Id) {
                        $.File.DisplayColumns[k][columnData[i].Action] = columnData[i].Data;
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
        //$.File.ColumnFilters = { Active: "true" };

        // We check the column filters and re-apply them and set the filter values into the text boxes
        $.each($.File.ColumnFilters, function (key, value) {
            $("[data-filterId='" + key + "']").val(value);
        })

        // Set the active filter and grid references
        $.CSF.globalColumnFilters = $.File.ColumnFilters;
        $.CSF.globalGridReference = $.File.Grid;
        $.File.DataView.refresh();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    InitializeGrid: function () {
        // create a deferred object
        var def = $.Deferred();

        $.File.Grid = new Slick.Grid("#" + $.File.GridContainer, $.File.DataView, $.File.DisplayColumns, $.File.GridOptions);

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
                    $.GUM.SaveToCookie($.File.CookieName, JSON.stringify($.File.Grid.getColumns()));
                    break;
                case 'Clear':
                    $.GUM.ClearFromCookie($.File.CookieName);
                    break;
                case 'Export':
                    $.GUM.ExportSlickGrid($.File.Grid, $.File.DataView);
                    break;
                default:
                    alert('Invalid menu command!');
            }
        });

        // register the header menu plugin
        $.File.Grid.registerPlugin(headerMenuPlugin);

        // Note that the columns are the manually defined columns, which is necessary for the column picker to have all columns in it, not just the ones saved in the cookie
        var activityColumnpicker = new Slick.Controls.ColumnPicker($.File.Columns, $.File.Grid, $.File.GridOptions);

        // register the group item metadata provider to add expand/collapse group handlers
        $.File.Grid.registerPlugin($.File.GroupItemMetadataProvider);

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    WireGridEvents: function () {
        // create a deferred object
        var def = $.Deferred();

        // Our scroll event
        $.File.Grid.onScroll.subscribe(function (e, args) {
            // Actions here
        });

        // Our sort function
        $.File.Grid.onSort.subscribe(function (e, args) {
            $.CSC.globalSortColumns = args.sortCols;
            $.File.DataView.sort($.CSC.globalMultiColumnComparer, args.sortAsc);
        });

        // Row count change event
        $.File.DataView.onRowCountChanged.subscribe(function (e, args) {
            $.File.Grid.updateRowCount();
            $.File.Grid.render();
            $.File.UpdateRecordCount();
        });

        // Row chnge event
        $.File.DataView.onRowsChanged.subscribe(function (e, args) {
            $.File.Grid.invalidateRows(args.rows);
            $.File.Grid.render();
        });

        // Delegate handler for the filters in the header row
        $($.File.Grid.getHeaderRow()).delegate(":input", "change keyup", function (e) {
            var columnId = $(this).data("columnId");
            if (columnId != null) {
                // We create a local copy of the filters and then assign the value to the global filters
                $.File.ColumnFilters[columnId] = $.trim($(this).val());
                $.CSF.globalColumnFilters = $.File.ColumnFilters;

                // We assign our grid to the global grid reference for the global search filter to use and then refresh the grid.  This allows multiple grids to use the same search filter
                $.CSF.globalGridReference = $.File.Grid;
                $.File.DataView.refresh();
                $.File.UpdateRecordCount();
            }
        });

        $.File.Grid.onHeaderRowCellRendered.subscribe(function (e, args) {
            $(args.node).empty();
            $("<input type='text'>")
               .data("columnId", args.column.id)
               .val($.CSF.globalColumnFilters[args.column.id])
                .attr("data-filterId", args.column.id)
               .appendTo(args.node);
        });

        $.File.DataView.setFilter($.CSF.globalFilter);
        $.File.Grid.init();

        $.File.UpdateRecordCount();
        $.File.ResizeGrid();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    UpdateRecordCount: function () {
        var negativeRows = $.File.DataView.getGroups().length * 2;
        $('#' + $.File.CounterName).text('| ' + Number($.File.DataView.getLength() - negativeRows) + ' Records');
    },

    ResizeGrid: function () {
        $.File.ResizeGridContainer();

        if ($.File.Grid) {
            $.File.Grid.resizeCanvas();
        }
    },

    ResizeGridContainer: function () {
        $('#' + $.File.GridContainer).height($(window).height() - $("#ProductsContainer").height() - $("#RegistrantContainer").height() - 35);
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
                    $.File.DataView.addItem({
                        id: response.File.Id,
                        Name: response.File.Name,
                        Formulation: $('#FormulationId option:selected').text(),
                        FormulationId: response.File.FormulationId,
                        IntendedUser: $('#IntendedUserId option:selected').text(),
                        IntendedUserId: response.File.IntendedUserId,
                        Registrant: $('#RegistrantId option:selected').text(),
                        RegistrantId: response.File.RegistrantId,
                        SignalWord: $('#SignalWordId option:selected').text(),
                        SignalWordId: response.File.SignalWordId,
                        Usage: $('#UsageId option:selected').text(),
                        UsageId: response.File.UsageId,
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
        if (!confirm('Are you sure you want to permenantly and irrevocably delete this File and all associated records?')) {
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
                    $.File.DataView.deleteItem(id);
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

$(window).resize(function () {
    $.File.ResizeGrid();
});

$(window).load(function () {
    $.File.ResizeGridContainer();
    $.File.Driver();

    $('#ExportFileGrid').click(function () {
        $.GUM.ExportSlickGrid($.File.Grid, $.File.DataView);
    });

    $('#Overlay').click(function () {
        $('#Overlay').hide();
    });
});