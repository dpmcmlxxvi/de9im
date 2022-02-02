# [de9im][de9im-site]

[![build](https://travis-ci.org/dpmcmlxxvi/de9im.svg?branch=master)](https://travis-ci.org/dpmcmlxxvi/de9im)
[![coverage](https://img.shields.io/coveralls/dpmcmlxxvi/de9im.svg)](https://coveralls.io/r/dpmcmlxxvi/de9im?branch=master)
[![npm](https://badge.fury.io/js/de9im.svg)](https://badge.fury.io/js/de9im)
[![code](https://app.codacy.com/project/badge/Grade/d345359c8f91405da92ed455cd82288d)](https://www.codacy.com/gh/dpmcmlxxvi/de9im/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=dpmcmlxxvi/de9im&amp;utm_campaign=Badge_Grade)

`de9im` is a Javascript library that provides spatial predicate
functions defined by the [Dimensionally Extended Nine-Intersection Model
(DE-9IM)][de9im-wiki] and works with [GeoJSON][geojson-site] objects. It can
test if two geometries have one of the following relationships: `contains`,
`coveredby`, `covers`, `crosses`, `disjoint`, `equals`,  `intersects`,
`overlaps`, `touches`, `within`. It can be used client-side in a browser or
server-side with [Node.js][node-site].

<p align="center">
  <a href="https://en.wikipedia.org/wiki/DE-9IM#/media/File:TopologicSpatialRelarions2.png">
    <img alt="" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/TopologicSpatialRelarions2.png/400px-TopologicSpatialRelarions2.png">
  </a>
</p>

See [de9im examples][de9im-examples] for examples of geometries that satisfy
the various predicates using `de9im`.

See [pouchdb-geospatial][pouchdb-geospatial] for an example application that
uses `de9im` to perform spatial querying of GeoJSON objects in a database.

## GETTING STARTED

`de9im` depends on the [Turf.js][turf-site] library for performing spatial
operations which must be also included for client-side processing since Turf.js
is not bundled with `de9im`.

### In a browser

```html
<script src="https://unpkg.com/@turf/turf" charset="utf-8"></script>
<script src="https://unpkg.com/de9im" charset="utf-8"></script>
```

### In Node

```javascript
npm install de9im
const de9im = require('de9im');
```

Then call a predicate function on two geometries

```javascript
const line = {'type': 'LineString', 'coordinates': [[0, 0], [1, 1], [2, 2]]};
const point = {'type': 'Point', 'coordinates': [1, 1]};
de9im.contains(line, point);
// = true
de9im.disjoint(line, point);
// = false
```

## USAGE

### API

The `de9im` object has the following spatial predicate functions available:

```javascript
contains
coveredby
covers
crosses
disjoint
equals
intersects
overlaps
touches
within
```

Each predicate takes two GeoJSON arguments and an optional boolean argument:

```javascript
de9im.predicate(geojson1, geojson2, [error=true])
```

It returns true, false, or throws an exception if the geometry types provided
are not supported. If the optional argument `error` is false then unsupported
geometries return false instead of throwing an exception. Each predicate should
be interpreted as the first argument operating on the second. For example,

```javascript
de9im.contains(line, point)
```
should be read as

```shell
line contains point?
```

### Data Types

The arguments for every predicate can be any GeoJSON type: `Geometry`,
`Feature`, `GeometryCollection`, `FeatureCollection`. All geometry types are
supported: `Point`, `LineString`, `Polygon`, `MultiPoint`, `MultiLineString`,
`MultiPolygon`. However, only homogenous geometries are supported in
collections. For example, a FeatureCollection can have points but can not mix
points and lines.

### Argument Types

Each predicate has a unique combination of first and second argument geometries
that it supports.

-   `contains`, `covers`

    | 1st / 2nd | Point              | Line               | Polygon            |
    |:---------:|:------------------:|:------------------:|:------------------:|
    | Point     | :heavy_check_mark: | :x:                | :x:                |
    | Line      | :heavy_check_mark: | :heavy_check_mark: | :x:                |
    | Polygon   | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |

-   `coveredby`, `within`

    | 1st / 2nd | Point              | Line               | Polygon            |
    |:---------:|:------------------:|:------------------:|:------------------:|
    | Point     | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
    | Line      | :x:                | :heavy_check_mark: | :heavy_check_mark: |
    | Polygon   | :x:                | :x:                | :heavy_check_mark: |

-   `crosses`

    | 1st / 2nd | Point              | Line               | Polygon            |
    |:---------:|:------------------:|:------------------:|:------------------:|
    | Point     | :x:                | :heavy_check_mark: | :heavy_check_mark: |
    | Line      | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
    | Polygon   | :heavy_check_mark: | :heavy_check_mark: | :x:                |

-   `disjoint`, `intersects`

    | 1st / 2nd | Point              | Line               | Polygon            |
    |:---------:|:------------------:|:------------------:|:------------------:|
    | Point     | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
    | Line      | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
    | Polygon   | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |

-   `equals`, `overlaps`

    | 1st / 2nd | Point              | Line               | Polygon            |
    |:---------:|:------------------:|:------------------:|:------------------:|
    | Point     | :heavy_check_mark: | :x:                | :x:                |
    | Line      | :x:                | :heavy_check_mark: | :x:                |
    | Polygon   | :x:                | :x:                | :heavy_check_mark: |

-   `touches`

    | 1st / 2nd | Point              | Line               | Polygon            |
    |:---------:|:------------------:|:------------------:|:------------------:|
    | Point     | :x:                | :heavy_check_mark: | :heavy_check_mark: |
    | Line      | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
    | Polygon   | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |

## TIPS

The following are some best practices on using `de9im`:

-   Data is expected to be in [WGS 84][wgs84-wiki] coordinates as per the
    GeoJSON standard.

-   Data with the GeoJSON `bbox` attribute already defined will process faster.

-   Data with complex geometries (e.g., self-intersections, repeated
    coordinates) may produce invalid results.

-   Data coordinates should be truncated to avoid unrealistically high precision
    (more than 6 decimal places).

## ALGORITHM NOTES

The `de9im` library uses a partition approach to determine if two geometries
satisfy a given relation. This approach is different from the standard node/edge
labeling used by most DE-9IM implementations. Labeling approaches are only
defined for single geometries and not multi-geometries or collections and it is
not clear how to extend them to cover those cases.

Instead, `de9im` partitions each input geometry into elementary facets, where
each facet is either inside or outside the other geometry. For example, to test
two (multi-) polygons, the first (multi-) polygon is triangulated. This
triangulation gets intersected with the other (multi-) polygon's triangulation.
This intersection gets re-triangulated to create a decomposition of the first
(multi-) polygon such that each partition triangle (facet) is entirely inside or
outside the second (multi-) polygon. Finally, the decision of whether the
geometries satisfy the given predicate can be reduced to determining if the
individual facets satisfy the relation. The same goes for lines using segments
as the facets instead of triangles. This allows any geometry or collection type
to be processed.

Finally, while `de9im` has `turf` as a dependency, it does not use its DE-9IM
functions since it has only limited functionality and only covers a small subset
of all possible geometry and predicate combinations. The goal of `de9im` is to
cover all possible combinations. The `turf` library is only used for basic
spatial processing and geometry utility functions.

## BUILD

To build and test the library locally:

```shell
npm install
npm test
```

## BENCHMARK

Benchmark timing results can be found at [bench.md](bench.md).

## LICENSE

Copyright (c) 2019 Daniel Pulido <mailto:dpmcmlxxvi@gmail.com>

Source code is released under the [MIT License](http://opensource.org/licenses/MIT).

[de9im-examples]: https://dpmcmlxxvi.github.io/de9im/
[de9im-site]: https://github.com/dpmcmlxxvi/de9im
[de9im-wiki]: https://en.wikipedia.org/wiki/DE-9IM
[geojson-site]: http://geojson.org/
[node-site]: http://nodejs.org/
[pouchdb-geospatial]: https://github.com/dpmcmlxxvi/pouchdb-geospatial
[turf-site]: https://turfjs.org
[wgs84-wiki]: https://en.wikipedia.org/wiki/World_Geodetic_System
