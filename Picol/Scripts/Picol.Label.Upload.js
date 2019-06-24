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
        var details = "<a target='_blank' href='/Label/Details/" + dataContext["id"] + "'>Details</a>";
        var del = "<a href='javascript:void(0)' onclick='$.Label.Delete(" + dataContext["id"] + ")'>Delete</a>";
        return details + " | " + del;
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
        { id: "Epa", name: "Epa", field: "Epa", sortable: true },
        { id: "Name", name: "Name", field: "Name", sortable: true },
        { id: "Date", name: "Date", field: "Date", sortable: true },
        { id: "Line", name: "Line", field: "Line", sortable: true },
        { id: "Registrant", name: "Registrant", field: "Registrant", sortable: true },
        { id: "FileName", name: "FileName", field: "FileName", sortable: true },
        { id: "Format", name: "Format", field: "Format", sortable: true, formatter: Slick.Formatters.Checkmark, editor: Slick.Editors.Checkbox },
        { id: "Match", name: "Match", field: "Match", sortable: true, formatter: Slick.Formatters.Checkmark, editor: Slick.Editors.Checkbox },
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
            url: '/Label/GetUploads',
            data: {},
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    if (response.Labels.length == 0) {
                        // No data in report
                    } else {
                        for (var i = 0; i < response.Labels.length; i++) {
                            $.Label.Data[i] = {
                                "id": i,
                                "Epa": response.Labels[i]["Epa"],
                                "Name": response.Labels[i]["Name"],
                                "Date": response.Labels[i]["Date"],
                                "Line": response.Labels[i]["Line"],
                                "Registrant": response.Labels[i]["Registrant"],
                                "FileName": response.Labels[i]["FileName"],
                                "Format": response.Labels[i]["Format"],
                                "Match": response.Labels[i]["Match"],
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
        $('#' + $.Label.GridContainer).height($(window).height() - 35);
    },

    Create: function () {
        $.ajax({
            type: 'POST',
            url: '/Label/Create',
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
            url: '/Label/Update',
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
            url: '/Label/Delete',
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
    });

    $('#Create').click(function () {
        $('#CreateWindow').hide();
        $('#Overlay').hide();
        $.Label.Create();
    });
});