$.CertificateHelper = {
    QueueAndExecuteCommand: function (item, column, editCommand) {
        if (column['id'] == 'Name') {
            $.Certificate.Update(item.id, editCommand.serializedValue, item.FormulationId, item.IntendedUserId, item.RegistrantId, item.SignalWordId, item.UsageId, editCommand);
        } else {
            editCommand.execute();
            $('#OverlayDisplay').hide();
        }
    },

    ActionsFormatter: function (row, cell, value, columnDef, dataContext) {
        //var details = "<a target='_blank' href='/Certificate/Details/" + dataContext["id"] + "'>Details</a>";
        //var del = "<a href='javascript:void(0)' onclick='$.Certificate.Delete(" + dataContext["id"] + ")'>Delete</a>";
        var review = "<a href='/CertificateProcessing/Review?Code=" + dataContext["Code"] + "&FileName=" + dataContext["FileName"] + "' target='_blank'>Review</a>";

        return dataContext["Match"] ? review : "";
    }
}

$.Certificate = {
    CookieName: "Picol.Certificate.List.Grid",
    GridContainer: 'CertificateGrid',
    CounterName: 'CertificateCounter',
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
        { id: "Code", name: "Code", field: "Code", sortable: true },
        { id: "Date", name: "Date", field: "Date", sortable: true },
        { id: "FileName", name: "FileName", field: "FileName", sortable: true },
        { id: "ThirdParty", name: "ThirdParty", field: "ThirdParty", sortable: true, formatter: Slick.Formatters.Checkmark, editor: Slick.Editors.Checkbox },
        { id: "Format", name: "Format", field: "Format", sortable: true, formatter: Slick.Formatters.Checkmark, editor: Slick.Editors.Checkbox },
        { id: "Match", name: "Match", field: "Match", sortable: true, formatter: Slick.Formatters.Checkmark, editor: Slick.Editors.Checkbox },
        { id: "Actions", name: "Actions", field: "Actions", sortable: true, formatter: $.CertificateHelper.ActionsFormatter }
    ],

    GridOptions: {
        enableCellNavigation: true,
        editable: true,
        forceFitColumns: true,
        editCommandHandler: $.CertificateHelper.QueueAndExecuteCommand,
        autoEdit: true,
        showHeaderRow: true,
        headerRowHeight: 40,
        explicitInitialization: true,
        multiColumnSort: true,
        enableTextSelectionOnCells: true
    },

    Driver: function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Retrieving Certificates');
        $.Certificate.ResizeGridContainer();

        $.Certificate.Clean()
            .done($.Certificate.Instantiate)
            .done($.Certificate.GetCertificates)
            .done($.Certificate.BuildMenu)
            .done($.Certificate.ConfigureColumns)
            .done($.Certificate.InitializeGrid)
            .done($.Certificate.InitializeGridPlugins)
            .done($.Certificate.WireGridEvents)
            .done($.Certificate.ConfigureFilters);
    },

    Clean: function () {
        // create a deferred object
        var def = $.Deferred();

        if ($.Certificate.Grid) {
            $('#' + $.Certificate.CounterName).text('');
            $('#' + $.Certificate.CounterName).empty();
            $('#' + $.Certificate.CounterName + ' input').val('');

            var members = [];
            $.each($.Certificate.ColumnFilters, function (index, item) {
                item = '';
                members.push(index);
            });

            $.each(members, function (index, item) {
                $.Certificate.ColumnFilters[item] = '';
            });

            $.Certificate.Grid.invalidateAllRows();
            $('#' + $.Certificate.GridContainer).empty();
        }

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    Instantiate: function () {
        // create a deferred object
        var def = $.Deferred();

        $.Certificate.Data = [];
        $.Certificate.ColumnFilters = {};
        $.Certificate.DataView = new Slick.Data.DataView({
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
        for (var i = 0; i < $.Certificate.Columns.length; i++) {
            switch ($.Certificate.Columns[i]["id"]) {
                case 'Name':
                    $.Certificate.Columns[i].header = {
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

    GetCertificates: function () {
        // create a deferred object
        var def = $.Deferred();

        // We get our data from the server
        $.ajax({
            type: 'GET',
            url: '/CertificateProcessing/GetUploaded',
            data: {},
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    if (response.Certificates.length == 0) {
                        // No data in report
                    } else {
                        for (var i = 0; i < response.Certificates.length; i++) {
                            $.Certificate.Data[i] = {
                                "id": i,
                                "Name": response.Certificates[i]["Name"],
                                "Code": response.Certificates[i]["Code"],
                                "Date": response.Certificates[i]["Date"],
                                "ThirdParty": response.Certificates[i]["ThirdParty"],
                                "FileName": response.Certificates[i]["FileName"],
                                "Format": response.Certificates[i]["Format"],
                                "Match": response.Certificates[i]["Match"],
                                "Actions": ""
                            };
                        }

                        $.Certificate.DataView.setItems($.Certificate.Data);

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
        var cookieCols = $.GUM.GetFromCookie($.Certificate.CookieName);

        // We set the display columns to the manually defined columns
        $.Certificate.DisplayColumns = $.Certificate.Columns;

        if (cookieCols != null) {
            // Since the cookie exists we set the display columns to the JSON encoded column array in the cookie
            $.Certificate.DisplayColumns = JSON.parse(cookieCols);

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
                for (k = 0; k < $.Certificate.DisplayColumns.length; k++) {
                    if ($.Certificate.DisplayColumns[k].id == columnData[i].Id) {
                        $.Certificate.DisplayColumns[k][columnData[i].Action] = columnData[i].Data;
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
        //$.Certificate.ColumnFilters = { Active: "true" };

        // We check the column filters and re-apply them and set the filter values into the text boxes
        $.each($.Certificate.ColumnFilters, function (key, value) {
            $("[data-filterId='" + key + "']").val(value);
        })

        // Set the active filter and grid references
        $.CSF.globalColumnFilters = $.Certificate.ColumnFilters;
        $.CSF.globalGridReference = $.Certificate.Grid;
        $.Certificate.DataView.refresh();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    InitializeGrid: function () {
        // create a deferred object
        var def = $.Deferred();

        $.Certificate.Grid = new Slick.Grid("#" + $.Certificate.GridContainer, $.Certificate.DataView, $.Certificate.DisplayColumns, $.Certificate.GridOptions);

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
                    $.GUM.SaveToCookie($.Certificate.CookieName, JSON.stringify($.Certificate.Grid.getColumns()));
                    break;
                case 'Clear':
                    $.GUM.ClearFromCookie($.Certificate.CookieName);
                    break;
                case 'Export':
                    $.GUM.ExportSlickGrid($.Certificate.Grid, $.Certificate.DataView);
                    break;
                default:
                    alert('Invalid menu command!');
            }
        });

        // register the header menu plugin
        $.Certificate.Grid.registerPlugin(headerMenuPlugin);

        // Note that the columns are the manually defined columns, which is necessary for the column picker to have all columns in it, not just the ones saved in the cookie
        var activityColumnpicker = new Slick.Controls.ColumnPicker($.Certificate.Columns, $.Certificate.Grid, $.Certificate.GridOptions);

        // register the group item metadata provider to add expand/collapse group handlers
        $.Certificate.Grid.registerPlugin($.Certificate.GroupItemMetadataProvider);

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    WireGridEvents: function () {
        // create a deferred object
        var def = $.Deferred();

        // Our scroll event
        $.Certificate.Grid.onScroll.subscribe(function (e, args) {
            // Actions here
        });

        // Our sort function
        $.Certificate.Grid.onSort.subscribe(function (e, args) {
            $.CSC.globalSortColumns = args.sortCols;
            $.Certificate.DataView.sort($.CSC.globalMultiColumnComparer, args.sortAsc);
        });

        // Row count change event
        $.Certificate.DataView.onRowCountChanged.subscribe(function (e, args) {
            $.Certificate.Grid.updateRowCount();
            $.Certificate.Grid.render();
            $.Certificate.UpdateRecordCount();
        });

        // Row chnge event
        $.Certificate.DataView.onRowsChanged.subscribe(function (e, args) {
            $.Certificate.Grid.invalidateRows(args.rows);
            $.Certificate.Grid.render();
        });

        // Delegate handler for the filters in the header row
        $($.Certificate.Grid.getHeaderRow()).delegate(":input", "change keyup", function (e) {
            var columnId = $(this).data("columnId");
            if (columnId != null) {
                // We create a local copy of the filters and then assign the value to the global filters
                $.Certificate.ColumnFilters[columnId] = $.trim($(this).val());
                $.CSF.globalColumnFilters = $.Certificate.ColumnFilters;

                // We assign our grid to the global grid reference for the global search filter to use and then refresh the grid.  This allows multiple grids to use the same search filter
                $.CSF.globalGridReference = $.Certificate.Grid;
                $.Certificate.DataView.refresh();
                $.Certificate.UpdateRecordCount();
            }
        });

        $.Certificate.Grid.onHeaderRowCellRendered.subscribe(function (e, args) {
            $(args.node).empty();
            $("<input type='text'>")
               .data("columnId", args.column.id)
               .val($.CSF.globalColumnFilters[args.column.id])
                .attr("data-filterId", args.column.id)
               .appendTo(args.node);
        });

        $.Certificate.DataView.setFilter($.CSF.globalFilter);
        $.Certificate.Grid.init();

        $.Certificate.UpdateRecordCount();
        $.Certificate.ResizeGrid();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    UpdateRecordCount: function () {
        var negativeRows = $.Certificate.DataView.getGroups().length * 2;
        $('#' + $.Certificate.CounterName).text('| ' + Number($.Certificate.DataView.getLength() - negativeRows) + ' Records');
    },

    ResizeGrid: function () {
        $.Certificate.ResizeGridContainer();

        if ($.Certificate.Grid) {
            $.Certificate.Grid.resizeCanvas();
        }
    },

    ResizeGridContainer: function () {
        $('#' + $.Certificate.GridContainer).height($(window).height() - 35);
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
                    $.Certificate.DataView.addItem({
                        id: response.Certificate.Id,
                        Name: response.Certificate.Name,
                        Formulation: $('#FormulationId option:selected').text(),
                        FormulationId: response.Certificate.FormulationId,
                        IntendedUser: $('#IntendedUserId option:selected').text(),
                        IntendedUserId: response.Certificate.IntendedUserId,
                        Registrant: $('#RegistrantId option:selected').text(),
                        RegistrantId: response.Certificate.RegistrantId,
                        SignalWord: $('#SignalWordId option:selected').text(),
                        SignalWordId: response.Certificate.SignalWordId,
                        Usage: $('#UsageId option:selected').text(),
                        UsageId: response.Certificate.UsageId,
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
        if (!confirm('Are you sure you want to permenantly and irrevocably delete this certificate and all associated records?')) {
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
                    $.Certificate.DataView.deleteItem(id);
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
    $.Certificate.ResizeGrid();
});

$(window).load(function () {
    $.Certificate.ResizeGridContainer();
    $.Certificate.Driver();

    $('#ExportCertificateGrid').click(function () {
        $.GUM.ExportSlickGrid($.Certificate.Grid, $.Certificate.DataView);
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
        $.Certificate.Create();
    });
});