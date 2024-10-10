    
    // class ApiResponse {
    //   constructor(statuscode, data, message = "Success") {
    //     this.message = message;
    //     this.statuscode = statuscode;
    //     this.success = statuscode < 400; // Set success based on statuscode
    //     this.data = data;
    //   }
    // }

    // export { ApiResponse };

class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode < 400;
    this.data = data;
  }
}

export { ApiResponse };