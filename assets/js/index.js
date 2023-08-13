//creating a AJAX req to update result of interview
//this req will be triggered every time result option is changed
document.addEventListener('DOMContentLoaded', () => {
  const resultSelects = document.querySelectorAll('.resultSelect');

  resultSelects.forEach(resultSelect => {
    resultSelect.addEventListener('change', async (event) => {
      const interviewId = event.target.getAttribute('data-interview-id');
      const newResult = event.target.value;
      
      try {
        const response = await fetch(`/companies/updateResult/${interviewId}`, {
          method: 'PUT', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ result: newResult }),
        });

     
      } catch (error) {
        console.error('Error updating result:', error);
      }
    });
  });
});


//for changing student status:  
const statusSelects = document.querySelectorAll('.status-select');
    
statusSelects.forEach(select => {
  select.addEventListener('change', async (event) => {
      const studentId = event.target.getAttribute('data-student-id');
      const newStatus = event.target.value;
      
      try {
          const response = await fetch(`/studentList/updateStatus/${studentId}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ status: newStatus }),
          });
          
          // if (response.ok) {
          //     // Handle success, e.g., show a success message or update the UI
          // } else {
          //     // Handle error
          // }
      } catch (error) {
          console.error('Error updating student status:', error);
      }
  });
});