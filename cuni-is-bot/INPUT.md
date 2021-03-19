# Input format
This file contain information about the format of an input.

## Example
Let's use a simple example containing one class (a lecture and a tutorial) to enroll. 
```javascript
{
   "subjects": [
      {
         "lecture": "18aNMAI062p1",
         "tutorial": "18aNMAI062x03",
         "faculty": 11320,
         "year": 2018,
         "semester": 1,
         "enrollmentSucceededMsg" : "Algebra I has been enrolled.",
         "enrollmentFailedMsg": "Algebra I - FAILED."
      }
   ]
}
```
* "subjects"
    * This name is required.
* "lecture" / "tutorial"
    * Contains the lecture / tutorial ID.
    * It is the value of `gl` parameter of the lecture / tutorial page in your URL.
    * Example: https://is.cuni.cz/studium/rozvrhng/roz_predmet_gl.php?gl=18aNMAI062p1&fak=11320&skr=2018&sem=1.
* "faculty"
    * Contains the faculty code.
    * The value of `fak` in the subject URL.
    * [List of faculties codes](FACULTIES.md).
* "year"
    * For an academic year x / (x + 1) "year" value is always x.
    * So in 2019/2020 academic year for both semesters it's always 2019.
    * The value of `skr` in the subject URL.
* "semester"
    * Winter semester = 1
    * Summer semester = 2
    * The value of `sem` in the subject URL.
* "enrollmentSucceededMsg"
    * A message to be printed after the successful enrollment.
* "enrollmentFailedMsg"
    * A message to be printed after an enrollment failure.
## Tips
* If a class is just a lecture without a tutorial, "tutorial" line can be omitted (likewise for tutorial only classes).
* "year" and "semester" are optional.
* "enrollmentSucceededMsg" and "enrollmentFailedMsg" can be also omitted.
