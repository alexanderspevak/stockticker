import React, { Component } from 'react';

class Ticking extends Component {
    constructor(props) {
        super(props)
        this.renderTable = this.renderTable.bind(this)

    }
    renderTable() {
        
        const data=this.props.data;
        console.log('data',data)
        let tableData=[];
        for(var key in data){
            if(data.hasOwnProperty(key)){
                tableData.push(
                <tr key={key}>
                    <td>{key}:</td>
                    <td>{data[key]}</td>
                </tr>)
            }
        }
        return (
            <table>
                <tbody>
                    {tableData}
                </tbody>
            </table>)
    }
    render() {
        const renderTable = this.renderTable()
        return (
            <div>
                  { renderTable }
            </div>
          
        )
    }
}

export default Ticking;