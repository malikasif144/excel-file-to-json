import React from 'react';
import { useState, useEffect } from 'react';
import *as XlSX from 'xlsx'
import './App.css';

function App() {
  const[excelFile, setExcelFile] = useState('');
  const[excelFileError, setExcelFileError] = useState('');
  console.log(excelFile)
  const [excelData, setExcelData] = useState([])
  const fileType = ['application/vnd.ms-excel'];

  const handleFile = (e:any) => {
    let selectedFile = e.target.files[0];
    if(selectedFile){
      console.log(selectedFile.type)
      if(selectedFile && fileType.includes(selectedFile.type))
      {
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);

        reader.onload=(e:any)=>{
          setExcelFileError('');
          setExcelFile(e.target.result)
        }

      }else{

        setExcelFileError('Please select only excel file');
        setExcelFile('')

      }

    }else{
      console.log("plz selecte file")
    }
  }


const handleSubmit = (e:any) => {
  e.preventDefault();
  if(excelFile !== null){
    const workBook = XlSX.read(excelFile,{type:"buffer"});
    const workSheetName = workBook.SheetNames[0];
    const workSheet = workBook.Sheets[workSheetName];
    const data:any = XlSX.utils.sheet_to_json(workSheet);
    setExcelData(data);
    console.log("data in excelfile 1 :>> ", data)
  } else{
    console.log("data in excelfile 2 :>> ")
    setExcelData([]);
  }
}


useEffect(() => {
  console.log('excelData useeffect :>> ', excelData);
}, [excelData])


  return (
    <div className="container">
     { /*upload file section */}
      <div className='form'>
        <form className='form-group' autoComplete='off' onSubmit={handleSubmit}>
          <label><h5>Upload Excel File</h5></label>
          <input type='file' className='form-control' onChange={handleFile} required/>
          {excelFileError&&<div className='text-danger p-3'>{excelFileError}</div>}
          <button type='submit' className='btn btn-success'
          style={{marginTop:5+'px'}}>Submit</button>
        </form>
        <hr></hr>
     { /*view file section */}
     <h5>View File</h5>
     <div className='viewer'>
      {
        excelData?
        <div className='table-responsive'>
        <table className='table'>
          <thead>
            <tr>
              <th scope='col'>ID</th>
              <th scope='col'>Gender</th>
              <th scope='col'>Country</th>
              <th scope='col'>Age</th>
              <th scope='col'>Date</th>                  
            </tr>
          </thead>
          <tbody>
            {excelData.map(
              (item:any) => {
              return(
                  <tr key={item.Id}>
                    <td>{item.Id}</td>
                    <td>{item.Gender}</td>
                    <td>{item.Country}</td>
                    <td>{item.Age}</td>
                    <td>{item.Date}</td>
                  </tr>
                )
            })}
          </tbody>
        </table>            
      </div>:"No File Selected"
      }
      </div>
      </div>
      </div>
  );
}

export default App;
