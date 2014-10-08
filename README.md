extract-sample
==============

Extract a sample record from a binary file and formats as a C string


## Usage

````
$ extract-sample test/fixtures/cat.exe 0x00 0x16
// Extracted from test/fixtures/cat.exe [Tue, 07 Oct 2014 12:42:29 GMT]
// 16 bytes from 0x00000000 to 0x00000010
const char * test_fixtures_cat_exe_0x00000000_16 =\
"Data: DATA 16\n"
"$ 4d 5a 90 00 03 00 00 00  04 00 00 00 ff ff 00 00  MZ..............\n" // 00-0F
;

````
