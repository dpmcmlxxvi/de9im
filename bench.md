# Timing bench test results for `de9im`

The following presents the number of operations per second to process each
pair of geometries with the given relation by each predicate. An :x:
indicates the predicate is not supported for those geometries. The fastest
and slowest times are highlighted. The geometries tested are in
`test/data/bench`.

<!--lint disable maximum-line-length-->
| first | relation | second | contains | coveredby | covers | crosses | disjoint | equals | intersects | overlaps | touches | within |
|:-----:|:--------:|:------:|:--------:|:---------:|:------:|:-------:|:--------:|:------:|:----------:|:--------:|:-------:|:------:|
| LineString | contains | LineString | 44,169 | 491,200 | 44,210 | 48,136 | 46,871 | 428,754 | 46,482 | <span style="color:red">**16,088**</span> | 32,246 | <span style="color:green">**491,281**</span> |
| LineString | coveredby | LineString | 659,247 | <span style="color:green">**801,112**</span> | 604,411 | 59,241 | 62,227 | 327,589 | 71,260 | 788,965 | <span style="color:red">**50,526**</span> | 799,497 |
| LineString | covers | LineString | 56,062 | <span style="color:green">**332,611**</span> | 56,097 | 93,098 | 90,484 | 286,708 | 90,193 | <span style="color:red">**18,945**</span> | 50,419 | 305,879 |
| LineString | crosses | LineString | 413,673 | <span style="color:green">**444,211**</span> | 396,629 | 14,798 | 14,761 | 402,621 | 15,212 | <span style="color:red">**9,730**</span> | 75,594 | 434,681 |
| LineString | disjoint | LineString | 1,195,654 | 1,763,070 | <span style="color:red">**1,159,763**</span> | 1,817,881 | 1,210,980 | 1,240,754 | 1,870,887 | 1,847,829 | 1,856,578 | <span style="color:green">**1,878,065**</span> |
| LineString | equals | LineString | 619,477 | <span style="color:green">**763,990**</span> | 625,824 | 63,915 | <span style="color:red">**63,797**</span> | 327,089 | 64,116 | 756,953 | 80,428 | 756,008 |
| LineString | intersects | LineString | 272,453 | <span style="color:green">**471,241**</span> | 283,671 | 45,381 | 43,926 | 416,958 | 44,518 | <span style="color:red">**12,201**</span> | 35,603 | 459,026 |
| LineString | overlaps | LineString | 270,569 | 454,557 | 268,580 | 37,100 | 33,225 | 390,946 | 37,962 | <span style="color:red">**10,355**</span> | 27,177 | <span style="color:green">**462,470**</span> |
| LineString | touches | LineString | 423,026 | 379,609 | <span style="color:green">**430,091**</span> | 53,385 | 57,209 | 345,520 | 58,919 | <span style="color:red">**41,846**</span> | 48,777 | 375,286 |
| LineString | within | LineString | 424,308 | 44,585 | <span style="color:green">**430,166**</span> | 49,865 | 49,201 | 39,215 | 50,009 | <span style="color:red">**25,598**</span> | 34,428 | 44,077 |
| LineString | coveredby | Polygon | :x: | 49,583 | :x: | 42,786 | 15,431 | :x: | <span style="color:red">**15,303**</span> | :x: | <span style="color:green">**56,295**</span> | 42,109 |
| LineString | crosses | Polygon | :x: | 29,145 | :x: | 27,713 | 16,631 | :x: | <span style="color:red">**16,580**</span> | :x: | <span style="color:green">**29,870**</span> | 29,201 |
| LineString | disjoint | Polygon | :x: | 56,567 | :x: | 42,930 | 14,314 | :x: | <span style="color:red">**14,051**</span> | :x: | 27,291 | <span style="color:green">**56,721**</span> |
| LineString | intersects | Polygon | :x: | <span style="color:green">**35,616**</span> | :x: | 29,823 | <span style="color:red">**13,904**</span> | :x: | 13,914 | :x: | 32,649 | 35,069 |
| LineString | touches | Polygon | :x: | <span style="color:green">**29,618**</span> | :x: | 28,797 | <span style="color:red">**12,502**</span> | :x: | 12,515 | :x: | 25,763 | 29,548 |
| LineString | within | Polygon | :x: | <span style="color:green">**71,157**</span> | :x: | 56,313 | <span style="color:red">**15,913**</span> | :x: | 16,000 | :x: | 67,338 | 57,131 |
| MultiPoint | coveredby | LineString | :x: | 300,137 | :x: | <span style="color:red">**190,506**</span> | 364,405 | :x: | <span style="color:green">**460,822**</span> | :x: | 352,163 | 194,850 |
| MultiPoint | crosses | LineString | :x: | 349,572 | :x: | <span style="color:red">**252,761**</span> | 356,264 | :x: | 445,004 | :x: | <span style="color:green">**458,659**</span> | 352,162 |
| MultiPoint | disjoint | LineString | :x: | 1,113,891 | :x: | 1,040,519 | <span style="color:red">**626,844**</span> | :x: | 1,045,568 | :x: | 1,086,855 | <span style="color:green">**1,119,452**</span> |
| MultiPoint | intersects | LineString | :x: | <span style="color:green">**472,459**</span> | :x: | 293,622 | 254,582 | :x: | 296,277 | :x: | <span style="color:red">**172,893**</span> | 465,178 |
| MultiPoint | touches | LineString | :x: | <span style="color:green">**467,272**</span> | :x: | 293,511 | 256,039 | :x: | 298,818 | :x: | <span style="color:red">**171,793**</span> | 463,885 |
| MultiPoint | within | LineString | :x: | 351,684 | :x: | 259,671 | 380,512 | :x: | 461,112 | :x: | <span style="color:green">**470,963**</span> | <span style="color:red">**251,440**</span> |
| MultiPoint | contains | MultiPoint | 281,376 | 353,199 | 318,561 | :x: | 386,068 | <span style="color:red">**156,165**</span> | <span style="color:green">**551,060**</span> | 301,074 | :x: | 393,067 |
| MultiPoint | coveredby | MultiPoint | 295,169 | 380,827 | 305,074 | :x: | 396,061 | <span style="color:red">**152,012**</span> | <span style="color:green">**544,725**</span> | 294,572 | :x: | 391,302 |
| MultiPoint | covers | MultiPoint | 303,619 | 372,870 | 300,767 | :x: | 394,641 | <span style="color:red">**152,164**</span> | <span style="color:green">**536,889**</span> | 295,130 | :x: | 389,448 |
| MultiPoint | disjoint | MultiPoint | <span style="color:red">**556,592**</span> | <span style="color:green">**985,370**</span> | 565,456 | :x: | 576,834 | 581,375 | 966,378 | 976,434 | :x: | 962,441 |
| MultiPoint | equals | MultiPoint | 415,772 | 541,083 | 407,372 | :x: | 464,682 | <span style="color:red">**210,241**</span> | <span style="color:green">**646,881**</span> | 414,359 | :x: | 537,355 |
| MultiPoint | intersects | MultiPoint | 310,127 | <span style="color:green">**546,387**</span> | 293,110 | :x: | 322,067 | 368,676 | 422,143 | <span style="color:red">**208,771**</span> | :x: | 513,146 |
| MultiPoint | overlaps | MultiPoint | 367,459 | <span style="color:green">**497,181**</span> | 363,194 | :x: | 318,906 | 362,705 | 407,270 | <span style="color:red">**242,126**</span> | :x: | 492,442 |
| MultiPoint | within | MultiPoint | 286,272 | 361,890 | 280,655 | :x: | 371,111 | <span style="color:red">**129,921**</span> | <span style="color:green">**481,339**</span> | 214,579 | :x: | 317,229 |
| MultiPoint | coveredby | Polygon | :x: | 92,793 | :x: | <span style="color:red">**66,995**</span> | 192,061 | :x: | <span style="color:green">**222,200**</span> | :x: | 221,383 | 77,139 |
| MultiPoint | disjoint | Polygon | :x: | 214,485 | :x: | 103,435 | 97,357 | :x: | 103,277 | :x: | <span style="color:red">**55,003**</span> | <span style="color:green">**220,994**</span> |
| MultiPoint | intersects | Polygon | :x: | 213,962 | :x: | <span style="color:red">**75,638**</span> | 128,518 | :x: | 139,044 | :x: | 102,893 | <span style="color:green">**217,789**</span> |
| MultiPoint | touches | Polygon | :x: | 144,748 | :x: | 144,653 | 204,792 | :x: | <span style="color:green">**227,447**</span> | :x: | 98,939 | <span style="color:red">**78,792**</span> |
| MultiPoint | within | Polygon | :x: | 140,032 | :x: | <span style="color:red">**98,817**</span> | 203,930 | :x: | <span style="color:green">**233,284**</span> | :x: | 231,144 | 101,114 |
| Polygon | contains | Polygon | <span style="color:green">**285,371**</span> | <span style="color:red">**187**</span> | 280,372 | :x: | 41,967 | 191 | 43,133 | 195 | 191 | 195 |
| Polygon | coveredby | Polygon | 219,490 | 53 | 218,634 | :x: | 53 | <span style="color:red">**53**</span> | 54 | 53 | <span style="color:green">**226,625**</span> | 53 |
| Polygon | covers | Polygon | 191 | 305,541 | 191 | :x: | 33,808 | 291,912 | 34,343 | <span style="color:red">**125**</span> | 336 | <span style="color:green">**310,215**</span> |
| Polygon | disjoint | Polygon | <span style="color:green">**362,881**</span> | 239,893 | 354,385 | :x: | <span style="color:red">**12,200**</span> | 222,793 | 12,579 | 40,085 | 12,986 | 248,739 |
| Polygon | equals | Polygon | 150 | 155 | 149 | :x: | 32,878 | <span style="color:red">**81**</span> | <span style="color:green">**39,396**</span> | 172 | 161 | 165 |
| Polygon | intersects | Polygon | <span style="color:green">**400,309**</span> | 108 | 397,768 | :x: | 13,449 | 109 | 12,683 | <span style="color:red">**75**</span> | 273,066 | 116 |
| Polygon | overlaps | Polygon | <span style="color:green">**420,752**</span> | 111 | 413,050 | :x: | 13,634 | 115 | 13,720 | <span style="color:red">**76**</span> | 275,597 | 115 |
| Polygon | touches | Polygon | <span style="color:green">**414,684**</span> | 496 | 409,453 | :x: | 40,679 | 496 | 41,321 | 496 | 470 | <span style="color:red">**460**</span> |
| Polygon | within | Polygon | 236,097 | <span style="color:red">**57**</span> | 235,829 | :x: | 57 | 57 | 57 | 57 | <span style="color:green">**241,246**</span> | 57 |

<!--lint enable maximum-line-length-->
