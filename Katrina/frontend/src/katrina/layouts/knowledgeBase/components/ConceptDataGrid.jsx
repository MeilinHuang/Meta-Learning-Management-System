import React from 'react';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link } from 'react-router-dom';

const ConceptDataGrid = ({ courseList }) => {
  // const [columns, setColumns] = React.useState([]);
  const [rows, setRows] = React.useState([]);

  const columns = [
    { field: 'code', headerName: 'Course Code', width: 130 },
    { field: 'name', headerName: 'Course Name', width: 120 },
    { field: 'term', headerName: 'Term', minWidth: 80 },
    { field: 'lecTit', headerName: 'Lecture Title', width: 120 },
    { field: 'week', headerName: 'Week', width: 70 },
    { field: 'lastUpd', headerName: 'Updated At', width: 100 },
    { field: 'public', headerName: 'Public', width: 100 },

    {
      field: 'conc', headerName: 'Concepts', width: 400, renderCell: (params) => (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {
            params.value.sort().map((c, idx) => (
              <div key={idx}>
                <Link key={idx} to={`/student/knowledge-base/${c}`}>[{c}]</Link>&nbsp;
              </div>
            ))
          }
        </div>
      )
    },
  ]

  React.useEffect(() => {
    const tmpRow = [];
    Object.keys(courseList).forEach((course_id) => {
      Object.keys(courseList[course_id].lectures).forEach((lecture_id) => {
        tmpRow.push({
          id: courseList[course_id].lectures[lecture_id].notes_id,
          code: courseList[course_id].course_code,
          name: courseList[course_id].course_name,
          term: courseList[course_id].course_term,
          lecTit: courseList[course_id].lectures[lecture_id].lecture_title,
          week: courseList[course_id].lectures[lecture_id].lecture_week,
          conc: courseList[course_id].lectures[lecture_id].concepts,
          lastUpd: courseList[course_id].lectures[lecture_id].last_update,
          public: courseList[course_id].lectures[lecture_id].is_public,

        });
      })
    })
    setRows(tmpRow);
    // eslint-disable-next-line 
  }, [])

  return (
    <div style={{ height: 600, width: "100%" }} >
      <DataGrid
        rows={rows}
        columns={columns}
        components={{
          Toolbar: GridToolbar
        }}
        initialState={{
          filter: {
            filterModel: {
              items: [
                {
                  columnField: "commodity",
                  operatorValue: "contains",
                  value: "rice"
                }
              ]
            }
          }
        }}
      />
    </div>
  );
}

export default ConceptDataGrid;
