$.RegulationAuthorityHelper = {
    QueueAndExecuteCommand: function (item, column, editCommand) {
        if (column['id'] == 'Name') {
            $.RegulationAuthority.Update(item.id, editCommand.serializedValue, item.Description, editCommand);
        }  else if (column['id'] == 'Description') {
            $.RegulationAuthority.Update(item.id, item.Name, editCommand.serializedValue, editCommand);
        } else {
            editCommand.execute();
            $('#OverlayDisplay').hide();
        }
    },

    ActionsFormatter: function (row, cell, value, columnDef, dataContext) {
        var details = "<a href='/RegulationAuthority/Details/" + dataContext["id"] + "'>Details</a>";
        var del = "<a href='javascript:void(0)' onclick='$.RegulationAuthority.Delete(" + dataContext["id"] + ")'>Delete</a>";
        return details + " | " + del;
    }
}

$.RegulationAuthority = {
    CookieName: "Picol.RegulationAuthority.List.Grid",
    GridContainer: 'RegulationAuthorityGrid',
    CounterName: 'RegulationAuthorityCounter',
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
        { id: "Description", name: "Description", field: "Description", sortable: true, editor: Slick.Editors.Text },
        { id: "Actions", name: "Actions", field: "Actions", sortable: true, formatter: $.RegulationAuthorityHelper.ActionsFormatter }
    ],

    GridOptions: {
        enableCellNavigation: true,
        editable: true,
        forceFitColumns: true,
        editCommandHandler: $.RegulationAuthorityHelper.QueueAndExecuteCommand,
        autoEdit: true,
        showHeaderRow: true,
        headerRowHeight: 40,
        explicitInitialization: true,
        multiColumnSort: true,
        enableTextSelectionOnCells: true
    },

    Driver: function () {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Retrieving RegulationAuthorities');
        $.RegulationAuthority.ResizeGridContainer();

        $.RegulationAuthority.Clean()
            .done($.RegulationAuthority.Instantiate)
            .done($.RegulationAuthority.GetRegulationAuthorities)
            .done($.RegulationAuthority.BuildMenu)
            .done($.RegulationAuthority.ConfigureColumns)
            .done($.RegulationAuthority.InitializeGrid)
            .done($.RegulationAuthority.InitializeGridPlugins)
            .done($.RegulationAuthority.WireGridEvents)
            .done($.RegulationAuthority.ConfigureFilters);
    },

    Clean: function () {
        // create a deferred object
        var def = $.Deferred();

        if ($.RegulationAuthority.Grid) {
            $('#' + $.RegulationAuthority.CounterName).text('');
            $('#' + $.RegulationAuthority.CounterName).empty();
            $('#' + $.RegulationAuthority.CounterName + ' input').val('');

            var members = [];
            $.each($.RegulationAuthority.ColumnFilters, function (index, item) {
                item = '';
                members.push(index);
            });

            $.each(members, function (index, item) {
                $.RegulationAuthority.ColumnFilters[item] = '';
            });

            $.RegulationAuthority.Grid.invalidateAllRows();
            $('#' + $.RegulationAuthority.GridContainer).empty();
        }

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    Instantiate: function () {
        // create a deferred object
        var def = $.Deferred();

        $.RegulationAuthority.Data = [];
        $.RegulationAuthority.ColumnFilters = {};
        $.RegulationAuthority.DataView = new Slick.Data.DataView({
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
        for (var i = 0; i < $.RegulationAuthority.Columns.length; i++) {
            switch ($.RegulationAuthority.Columns[i]["id"]) {
                case 'Name':
                    $.RegulationAuthority.Columns[i].header = {
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

    GetRegulationAuthorities: function () {
        // create a deferred object
        var def = $.Deferred();

        // We get our data from the server
        $.ajax({
            type: 'GET',
            url: '/RegulationAuthority/Get',
            data: {},
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    if (response.RegulationAuthorities.length == 0) {
                        // No data in report
                    } else {
                        for (var i = 0; i < response.RegulationAuthorities.length; i++) {
                            $.RegulationAuthority.Data[i] = {
                                "id": response.RegulationAuthorities[i]["Id"],
                                "Name": response.RegulationAuthorities[i]["Name"],
                                "Description": response.RegulationAuthorities[i]["Description"],
                                "Actions": ""
                            };
                        }

                        $.RegulationAuthority.DataView.setItems($.RegulationAuthority.Data);

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
        var cookieCols = $.GUM.GetFromCookie($.RegulationAuthority.CookieName);

        // We set the display columns to the manually defined columns
        $.RegulationAuthority.DisplayColumns = $.RegulationAuthority.Columns;

        if (cookieCols != null) {
            // Since the cookie exists we set the display columns to the JSON encoded column array in the cookie
            $.RegulationAuthority.DisplayColumns = JSON.parse(cookieCols);

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
                for (k = 0; k < $.RegulationAuthority.DisplayColumns.length; k++) {
                    if ($.RegulationAuthority.DisplayColumns[k].id == columnData[i].Id) {
                        $.RegulationAuthority.DisplayColumns[k][columnData[i].Action] = columnData[i].Data;
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
        //$.RegulationAuthority.ColumnFilters = { Active: "true" };

        // We check the column filters and re-apply them and set the filter values into the text boxes
        $.each($.RegulationAuthority.ColumnFilters, function (key, value) {
            $("[data-filterId='" + key + "']").val(value);
        })

        // Set the active filter and grid references
        $.CSF.globalColumnFilters = $.RegulationAuthority.ColumnFilters;
        $.CSF.globalGridReference = $.RegulationAuthority.Grid;
        $.RegulationAuthority.DataView.refresh();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    InitializeGrid: function () {
        // create a deferred object
        var def = $.Deferred();

        $.RegulationAuthority.Grid = new Slick.Grid("#" + $.RegulationAuthority.GridContainer, $.RegulationAuthority.DataView, $.RegulationAuthority.DisplayColumns, $.RegulationAuthority.GridOptions);

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
                    $.GUM.SaveToCookie($.RegulationAuthority.CookieName, JSON.stringify($.RegulationAuthority.Grid.getColumns()));
                    break;
                case 'Clear':
                    $.GUM.ClearFromCookie($.RegulationAuthority.CookieName);
                    break;
                case 'Export':
                    $.GUM.ExportSlickGrid($.RegulationAuthority.Grid, $.RegulationAuthority.DataView);
                    break;
                default:
                    alert('Invalid menu command!');
            }
        });

        // register the header menu plugin
        $.RegulationAuthority.Grid.registerPlugin(headerMenuPlugin);

        // Note that the columns are the manually defined columns, which is necessary for the column picker to have all columns in it, not just the ones saved in the cookie
        var activityColumnpicker = new Slick.Controls.ColumnPicker($.RegulationAuthority.Columns, $.RegulationAuthority.Grid, $.RegulationAuthority.GridOptions);

        // register the group item metadata provider to add expand/collapse group handlers
        $.RegulationAuthority.Grid.registerPlugin($.RegulationAuthority.GroupItemMetadataProvider);

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    WireGridEvents: function () {
        // create a deferred object
        var def = $.Deferred();

        // Our scroll event
        $.RegulationAuthority.Grid.onScroll.subscribe(function (e, args) {
            // Actions here
        });

        // Our sort function
        $.RegulationAuthority.Grid.onSort.subscribe(function (e, args) {
            $.CSC.globalSortColumns = args.sortCols;
            $.RegulationAuthority.DataView.sort($.CSC.globalMultiColumnComparer, args.sortAsc);
        });

        // Row count change event
        $.RegulationAuthority.DataView.onRowCountChanged.subscribe(function (e, args) {
            $.RegulationAuthority.Grid.updateRowCount();
            $.RegulationAuthority.Grid.render();
            $.RegulationAuthority.UpdateRecordCount();
        });

        // Row chnge event
        $.RegulationAuthority.DataView.onRowsChanged.subscribe(function (e, args) {
            $.RegulationAuthority.Grid.invalidateRows(args.rows);
            $.RegulationAuthority.Grid.render();
        });

        // Delegate handler for the filters in the header row
        $($.RegulationAuthority.Grid.getHeaderRow()).delegate(":input", "change keyup", function (e) {
            var columnId = $(this).data("columnId");
            if (columnId != null) {
                // We create a local copy of the filters and then assign the value to the global filters
                $.RegulationAuthority.ColumnFilters[columnId] = $.trim($(this).val());
                $.CSF.globalColumnFilters = $.RegulationAuthority.ColumnFilters;

                // We assign our grid to the global grid reference for the global search filter to use and then refresh the grid.  This allows multiple grids to use the same search filter
                $.CSF.globalGridReference = $.RegulationAuthority.Grid;
                $.RegulationAuthority.DataView.refresh();
                $.RegulationAuthority.UpdateRecordCount();
            }
        });

        $.RegulationAuthority.Grid.onHeaderRowCellRendered.subscribe(function (e, args) {
            $(args.node).empty();
            $("<input type='text'>")
               .data("columnId", args.column.id)
               .val($.CSF.globalColumnFilters[args.column.id])
                .attr("data-filterId", args.column.id)
               .appendTo(args.node);
        });

        $.RegulationAuthority.DataView.setFilter($.CSF.globalFilter);
        $.RegulationAuthority.Grid.init();

        $.RegulationAuthority.UpdateRecordCount();
        $.RegulationAuthority.ResizeGrid();

        // Call resolve on the deferred object and return it
        def.resolve();
        return def;
    },

    UpdateRecordCount: function () {
        var negativeRows = $.RegulationAuthority.DataView.getGroups().length * 2;
        $('#' + $.RegulationAuthority.CounterName).text('| ' + Number($.RegulationAuthority.DataView.getLength() - negativeRows) + ' Records');
    },

    ResizeGrid: function () {
        this.ResizeGridContainer();

        if ($.RegulationAuthority.Grid) {
            $.RegulationAuthority.Grid.resizeCanvas();
        }
    },

    ResizeGridContainer: function () {
        $('#' + $.RegulationAuthority.GridContainer).height($(window).height() - 35);
    },

    Create: function () {
        $.ajax({
            type: 'POST',
            url: '/RegulationAuthority/Create',
            data: { code: $('#Code').val(), name: $('#Name').val(), description: $("#Description").val() },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    $.RegulationAuthority.DataView.addItem({
                        id: response.RegulationAuthority.Id,
                        Name: response.RegulationAuthority.Name,
                        Description: response.RegulationAuthority.Description,
                    });

                    $('#Name').val("");
                    $('#Description').val("");
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

    Update: function (id, name, description, editCommand) {
        $('#OverlayDisplay').show();
        $('#OverlayMessage').text('Updating');

        $.ajax({
            type: 'POST',
            url: '/RegulationAuthority/Update',
            data: { id: id, name: name, description: description },
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
        if (!confirm('Are you sure you want to permenantly and irrevocably delete this regulation authority and all associated records?')) {
            return;
        }

        $.ajax({
            type: 'POST',
            url: '/RegulationAuthority/Delete',
            data: { id: id },
            dataType: "json",
            success: function (response) {
                if (response.Error) {
                    alert(response.ErrorMessage);
                }
                else {
                    $.RegulationAuthority.DataView.deleteItem(id);
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
    $.RegulationAuthority.ResizeGrid();
});

$(window).load(function () {
    $.RegulationAuthority.ResizeGridContainer();
    $.RegulationAuthority.Driver();

    $('#ExportRegulationAuthorityGrid').click(function () {
        $.GUM.ExportSlickGrid($.RegulationAuthority.Grid, $.RegulationAuthority.DataView);
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
        $.RegulationAuthority.Create();
    });
});