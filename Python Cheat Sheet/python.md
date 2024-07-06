## PYTHON CHEAT SHEET 


## String Methods

- `capitalize()`
- `center(width[, fillchar])`
- `count(sub[, start[, end]])`
- `decode`
- `encode([encoding[, errors]])`
- `endswith(suffix[, start[, end]])`
- `expandtabs([tabsize])`
- `find(sub[, start[, end]])`
- `format(*args, **kwargs)`
- `index(sub[, start[, end]])`
- `isalnum()`
- `isalpha()`
- `isdigit()`
- `islower()`
- `isspace()`
- `istitle()`
- `isupper()`
- `join(iterable)`
- `ljust(width[, fillchar])`
- `lower()`
- `lstrip([chars])`
- `partition(sep)`
- `replace(old, new[, count])`
- `rfind(sub[, start[, end]])`
- `rindex(sub[, start[, end]])`
- `rjust(width[, fillchar])`
- `rpartition(sep)`
- `rsplit([sep[, maxsplit]])`
- `rstrip([chars])`
- `split([sep[, maxsplit]])`
- `splitlines([keepends])`
- `startswith(prefix[, start[, end]])`
- `strip([chars])`
- `swapcase`
- `title()`
- `translate(table[, deletechars])`
- `upper()`
- `zfill(width)`
- `isnumeric()`
- `isdecimal()`

## File Methods

- `close()`
- `flush()`
- `fileno()`
- `isatty()`
- `next()`
- `read([size])`
- `readline([size])`
- `readlines([sizehint])`
- `xreadlines()`
- `seek(offset[, whence])`
- `tell()`
- `truncate([size])`
- `write(str)`
- `writelines(sequence)`

## Attributes

- `closed`
- `encoding`
- `errors`
- `mode`
- `name`
- `newlines`
- `softspace`

## Set & Mapping

### Set Types

- `len(s)`
- `x in s`
- `x not in s`
- `isdisjoint(other)`
- `issubset(others)`
- `issuperset`
- `union(other...)`
- `intersection(other, ...)`
- `difference(other...)`
- `symmetric_difference(other)`
- `copy()`
- `update()`
- `intersection_update()`
- `difference_update()`
- `symmetric_difference_update()`
- `add(elem)`
- `remove()`
- `discard(elem)`
- `pop()`
- `clear()`

### Mapping Types

- `len(d)`
- `d[key]`
- `d[key] = value`
- `del d[key]`
- `key in d`
- `key not in d`
- `iter(d)`
- `clear()`
- `copy()`
- `fromkeys(seq[, value])`
- `get(key[, default])`
- `has_key(key)`
- `items()`
- `iteritems()`
- `iterkeys()`
- `itervalues()`
- `keys()`
- `pop(key[, default])`
- `popitem()`
- `setdefault(key[, default])`
- `update([other])`
- `values`

## Date Time

### Date Object

- `replace((year, month, day))`
- `timetuple()`
- `toordinal()`
- `weekday()()`
- `isoweekday()()`
- `isocalendar()()`
- `isoformat()`
- `__str__()`
- `ctime()`
- `strftime()`

### Datetime Object

- `date()`
- `time()`
- `timetz()`
- `replace([year[, month[, day[, hour[, minute[, second[, microsecond[, tzinfo]]]]]]]])`
- `astimezone(tz)`
- `utcoffset()`
- `dst()`
- `tzname()`
- `timetuple()`
- `utctimetuple()`
- `toordinal()`
- `weekday()`
- `isoweekday()`
- `isocalendar()`
- `isoformat()`
- `__str__()`
- `ctime()`
- `strftime()`

### Time Object

- `replace([hour[, minute[, second[, microsecond[, tzinfo]]]]])`
- `isoformat()`
- `__str__()`
- `strftime()`
- `utcoffset()`
- `dst()`
- `tzname()`

## Array

### Array Methods

- `append(x)`
- `buffer_info()`
- `byteswap()`
- `count(x)`
- `extend(iterable)`
- `fromfile(f,n)`
- `fromlist(list)`
- `fromstring(s)`
- `fromunicode(s)`
- `index(x)`
- `insert(i,x)`
- `pop([i])`
- `remove(x)`
- `reverse()`
- `tofile(f)`
- `tolist()`
- `tostring()`
- `tounicode()`

## Indexes and Slices

- `a=[0,1,2,3,4,5]`
- `6`
- `len(a)`
- `0`
- `a[0]`
- `5`
- `a[5]`
- `5`
- `a[-1]`
- `4`
- `a[-2]`
- `[1,2,3,4,5]`
- `a[1:]`
- `[0,1,2,3,4]`
- `a[:5]`
- `[0,1,2,3]`
- `a[:-2]`
- `[1,2]`
- `a[1:3]`
- `[1,2,3,4]`
- `a[1:-1]`

## Shallow copy of a

- `b=a[:]`

## Math

### Number Theoretic

- `ceil(x)`
- `copysign(x,y)`
- `fabs(x)`
- `factorial(x)`
- `floor(x)`
- `fmod(x,y)`
- `frexp(x)`
- `fsum(iterable)`
- `isinf(x)`
- `isnan(x)`
- `ldexp(x,i)`
- `modf()`
- `trunc()`

### Power and Logarithmic

- `exp(x)`
- `log(x[,base])`
- `log1p(x)`
- `log10(x)`
- `pow(x,y)`
- `sqrt(x)`

### Trigonometric Functions

- `acos(x)`
- `asin(x)`
- `atan(x)`
- `atan2(y,x)`
- `cos(x)`
- `hypot(x,y)`
- `sin(x)`
- `tan(x)`

### Angular Conversion

- `degrees(x)`
- `radians(x)`

### Hyperbolic Functions

- `acosh(x)`
- `asinh(x)`
- `atanh(x)`
- `cosh(x)`
- `sinh(x)`
- `tanh(x)`

### Constants

- `math.pi`
    - The mathematical constant π = 3.141592..., to available precision.
- `math.e`
    - The mathematical constant e = 2.718281..., to available precision.

## Random

### Functions

- `seed([x])`
- `getstate()`
- `setstate(state)`
- `jumpahead(n)`
- `getrandbits(k)`
- `randrange([start], stop[, step])`
- `randint(a,b)`
- `choice(seq)`
- `shuffle(x[,random])`
- `sample(population,k)`
- `random()`
- `uniform(a,b)`
- `triangular(low,high,mode)`
- `betavariate(alpha,beta)`
- `expovariate(lambd)`
- `gammavariate(alpha,beta)`
- `gauss(mu,sigma)`
- `lognormvariate(mu,sigma)`
- `normalvariate(mu,sigma)`
- `vonmisesvariate(mu,kappa)`
- `paretovariate(alpha)`
- `weibullvariate(alpha,beta)`

## Sys

### Sys Variables

- `argv`
    - Command line args
- `builtin_module_names`
    - Linked C modules
- `byteorder`
    - Native byte order
- `check_-interval`
    - Signal check frequency
- `exec_prefix`
    - Root directory
- `executable`
    - Name of executable
- `exitfunc`
    - Exit function name
- `modules`
    - Loaded modules
- `path`
    - Search path
- `platform`
    - Current platform
- `stdin, stdout, stderr`
    - File objects for I/O
- `version_info`
    - Python version info
- `winver`
    - Version number
- `sys.argv`
    - `foo.py`
- `sys.argv[0]`
    - `bar`
- `sys.argv[1]`
    - `-c`
- `sys.argv[2]`
    - `qux`
- `sys.argv[3]`
    - `--h`
- `sys.argv[4]`

## OS

### OS Variables

- `altsep`
    - Alternative sep
- `curdir`
    - Current dir string
- `defpath`
    - Default search path
- `devnull`
    - Path of null device
- `extsep`
    - Extension separator
- `linesep`
    - Line separator
- `name`
    - Name of OS
- `pardir`
    - Parent dir string
- `pathsep`
    - Patch separator
- `sep`
    - Path separator

## Class

### Special Methods

- `__new__(cls)`
- `__lt__(self, other)`
- `__init__(self, args)`
- `__le__(self, other)`
- `__del__(self)`
- `__gt__(self, other)`
- `__repr__(self)`
- `__ge__(self, other)`
- `__str__(self)`
- `__eq__(self, other)`
- `__cmp__(self, other)`
- `__ne__(self, other)`
- `__index__(self)`
- `__nonzero__(self)`
- `__hash__(self)`
- `__getattr__(self, name)`
- `__getattribute__(self, name)`
- `__setattr__(self, name, attr)`
- `__delattr__(self, name)`
- `__call__(self, args, kwargs)`

## String Formatting

### Formatting Operations

- `'d'`
    - Signed integer decimal.
- `'i'`
    - Signed integer decimal.
- `'o'`
    - Signed octal value.
- `'u'`
    - Obsolete type – it is identical to 'd'.
- `'x'`
    - Signed hexadecimal (lowercase).
- `'X'`
    - Signed hexadecimal (uppercase).
- `'e'`
    - Floating point exponential format (lowercase).
- `'E'`
    - Floating point exponential format (uppercase).
- `'f'`
    - Floating point decimal format.
- `'F'`
    - Floating point decimal format.
- `'g'`
    - Floating point format. Uses lowercase exponential format if exponent is less than -4 or not less than precision, decimal format otherwise.
- `'G'`
    - Floating point format. Uses uppercase exponential format if exponent is less than -4 or not less than precision, decimal format otherwise.
- `'c'`
    - Single character (accepts integer or single character string).
- `'r'`
    - String (converts any Python object using repr()).
- `'s'`
    - String (converts any Python object using str()).
- `'%'`
    - No argument is converted, results in a '%' character in the result.

### Date Formatting

#### Date Formatting

- `%a`
    - Abbreviated weekday (Sun)
- `%A`
    - Weekday (Sunday)
- `%b`
    - Abbreviated month name (Jan)
- `%B`
    - Month name (January)
- `%c`
    - Date and time
- `%d`
    - Day (leading zeros) (01 to 31)
- `%H`
    - 24 hour (leading zeros) (00 to 23)
- `%I`
    - 12 hour (leading zeros) (01 to 12)
- `%j`
    - Day of year (001 to 366)
- `%m`
    - Month (01 to 12)
- `%M`
    - Minute (00 to 59)
- `%p`
    - AM or PM
- `%S`
    - Second (00 to 61?)
- `%U`
    - Week number1 (00 to 53)
- `%w`
    - Weekday2 (0 to 6)
- `%W`
    - Week number3 (00 to 53)
- `%x`
    - Date
- `%X`
    - Time
- `%y`
    - Year without century (00 to 99)
- `%Y`
    - Year (2008)
- `%Z`
    - Time zone (GMT)
- `%%`
    - A literal "%" character 
