// takes an array and add it's eliments to the end of this array
// a = [1, 2, 3]
// b = [4, 5, 6, 7]
// a.extend(b)
// a => [1, 2, 3, 4, 5, 6, 7]
Array.prototype.extend = function(array)
{
    this.push.apply(this, array)
}

// use native index of to test for inclution
Array.prototype.inArray = function(val)
{
    return (this.indexOf(val) > -1)
}