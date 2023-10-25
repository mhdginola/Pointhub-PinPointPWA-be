# Express Error Handler

It is not hard to see that some people are struggling to handle errors, and some are even totally missing it. Handling errors properly means not only reducing the development time by finding bugs and errors easily but also developing a robust codebase for large-scale applications.

## Types of Errors in Node.js

First of all, it is necessary to have a clear understanding of errors in Node.js. In general, Node.js errors are divided into two distinct categories.

- **Operational errors** represent runtime problems whose results are expected and should be dealt with in a proper way. Operational errors don’t mean the application itself has bugs, but developers need to handle them thoughtfully. It means they need to be handled properly. Here’s a list of common operational errors:
  - Failed to connect to a database server.
  - Invalid inputs by the user.
  - Request timeout.
  - Resource not found (server responds with a 404 response code).

- **Programmer errors** represent unexpected bugs in poorly written code. They mean the code itself has some issues to solve and was coded wrong. A good example is to try to read a property of “undefined.” To fix the issue, the code has to be changed. That is a bug a developer made, not an operational error.
  - Trying to read a property on an object that is not defined.
  - Invoking or calling an asynchronous function without a callback.
  - Passing a string where a number was expected.
