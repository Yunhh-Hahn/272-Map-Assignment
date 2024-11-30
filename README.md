# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### How To Run
1. npm i 
2. npm run dev
3. password is `1234`, provided and changeable in src/lib/constants.js


### Report

1. Contribution (All group member equally contributed; 20% each)
- Wonchan Kim:
      1) Report List Implementation:
      Created ReportList.jsx to allow users to view the list of the reports.
      
      2) Report List & Table Features Implementation
        - Show reports accordingly to the current viewport. Zoomed in, Zoomed out action reflected.
        - Clicking on the report list shows the detail of the report
        - Implemented Resolve/View Comment feature
        - Sorting by different Criteria implementation
    
-  Kazi Boni Amin: 
      1) Report Form Implementation
      Created ReportForm.jsx to allow users to submit emergency reports with all required details.
      Auto-filled Time/Date and Status fields upon submission.

      2) Address Suggestions and Validation
      Implemented dynamic address suggestions restricted to Alberta and British Columbia.
      Ensured map marker repositioning based on address changes with updated geocode data.

      3) Modify and Delete Report Functionalities
      Added core functionalities for modifying and deleting reports with passcode protection.
      Used md5 hashing to store and verify passcodes securely.

      4) User Feedback and Error Handling
      Ensured real-time validation for required fields.
      Provided error messages for invalid inputs and incorrect passcodes.
      Handled geocoding errors during address suggestions and for map marker repositioning when the report was edited.
  
- Philip Ho
      1) Implemented Local Storage
      2) Implemented reverse affress lookup via geocode
      3) Style map popup
      4) Repository Managing & Debugging
      5) Code review & Refinement
      
- Nathan 
      1) Set up the foundatino for the project
      2) Implemented basic map function using API
      3) Created template for the popup
      4) Debugging for testing purpose & Code Refinement
   
- Chaitanya Mittal
      1) Contributed styling overall
      2) Contribute in implementing the modifying button on the table
      3) Implemented password feature using MD5
      4) Debugging & Code final Test
      5) User test scenario & Assignemnt Requirement Final Check Documentation

2. Documentation of Our Project
[Group 16 Documentation](./document/C272%20Map%20test.pdf)