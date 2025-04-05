# struct-layout-playground (Under Construction)

## Motivation

It would be nice to have an algorithm that can compute a layout for an arbitrary C structure that minimizes its size, that is not brute force.
This algorithm could also give insights into how to optimize the class layout in OOP based languages such as Java and C++. For example,
see this [relevant C++ proposal (PDF)](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2019/p1112r2.pdf).

We desire an algorithm better than brute force because it would be nice to automatically arrange the members of a structure to minimize size at compile time, assuming the developer gives us permission to do so (or if we are in a language that takes control of the structure layout by default, such as Rust). Real-life C structures can end up being quite large, and checking all the permutations of members would probably make compilation too slow if compiling a large program. Heuristics that _seem_ to work are not good enough either - it would be desirable to give a mathematical proof that an algorithm always gives us a layout that minimizes size, or at the very least, within some acceptable bound of the optimum.

Tools like `pahole` and clang's [static analyzer](https://clang.llvm.org/docs/analyzer/checkers.html#optin-performance-padding) are nice, but:

- `pahole` does not seem to correctly layout struct members that are overly aligned
- clang's static analyzer has a [decent heuristic](https://github.com/llvm/llvm-project/blob/dec47b76f406242dfb9d36da4d7adfb171c71104/clang/lib/StaticAnalyzer/Checkers/PaddingChecker.cpp#L232) for laying out overly aligned members, but there are counterexamples where the heuristic doesn't work.

This web application will find all optimal layouts for a C structure by brute force, in hopes that enough varied examples can give hints into how one can
create a better algorithm for the task.

## Running the Web Application

For now, starting up the app should be as simple as:

```
yarn dev
```
