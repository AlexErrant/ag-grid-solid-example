import {ModuleRegistry} from '@ag-grid-community/core';
import {Component, onMount} from 'solid-js';
import {createSignal} from "solid-js";
import AgGridSolid, {AgGridSolidRef} from '@ag-grid-community/solid';
import {ClientSideRowModelModule} from '@ag-grid-community/client-side-row-model';

import '@ag-grid-community/styles/ag-grid.css';
import "@ag-grid-community/styles/ag-theme-alpine.css";
import "./styles.css";
import spinnerGif from './images/spinner.gif';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export const MyRenderer = (props: any) => {
    return <span class="my-renderer">
        <img src={spinnerGif} class="my-spinner"/>
        <span class="my-renderer-value">{props.value}</span>
    </span>;
}

const App: Component = () => {

    const [getRowData, setRowData] = createSignal<any[]>([]);

    let gridRef: AgGridSolidRef;

    onMount(() => {
        fetch('https://www.ag-grid.com/example-assets/master-detail-data.json')
            .then(resp => resp.json())
            .then(data => {
                setRowData(data);
                setTimeout(() => gridRef!.api!.getDisplayedRowAtIndex(1)!.setExpanded(true), 100);
            });
    })

    const columnDefs = [
        { field: 'name', cellRenderer: 'agGroupCellRenderer' },
        { field: 'account', cellRenderer: MyRenderer },
        { field: 'calls' },
        { field: 'minutes', valueFormatter: "x.toLocaleString() + 'm'" }
    ];

    const defaultColDef = {
        flex: 1
    };


    const detailGridOptions = {
        rowSelection: "multiple",
        suppressRowClickSelection: true,
        enableRangeSelection: true,
        pagination: true,
        paginationAutoPageSize: true,
        columnDefs: [
            {
                field: "callId",
                checkboxSelection: true
            },
            {
                field: "direction",
                cellRenderer: MyRenderer
            },
            {
                field: "number",
                minWidth: 150
            },
            {
                field: "duration",
                valueFormatter: "x.toLocaleString() + 's'"
            },
            {
                field: "switchCode",
                minWidth: 150
            }
        ],
        defaultColDef: {
            sortable: true,
            flex: 1
        }
    };

    const detailCellRendererParams = {
        detailGridOptions: detailGridOptions,
        getDetailRowData: (params:any) => params.successCallback(params.data.callRecords)
    }

    return (
        <div style={{height: '100%', display: 'flex', "flex-direction": 'column'}}>
            <div class="ag-theme-alpine" style={{"flex-grow": 1}}>
                <AgGridSolid
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    masterDetail={true}
                    detailCellRendererParams={detailCellRendererParams}
                    rowData={getRowData()}
                    ref={gridRef!}
                />
            </div>
        </div>
    );
};

export default App;
