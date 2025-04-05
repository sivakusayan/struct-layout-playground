# struct-layout-playground (Under Construction)

It would be nice to have an algorithm that can compute a layout for an arbitrary C structure that minimizes its size, that is not brute force.
This algorithm could also give insights into how to optimize the class layout in OOP based languages such as Java and C++. For example,
see this [relevant C++ proposal (PDF)](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2019/p1112r2.pdf).

Tools like `pahole` and clang's [static analyzer](https://clang.llvm.org/docs/analyzer/checkers.html#optin-performance-padding) are nice, but:

- `pahole` does not seem to correctly layout struct members that are overly aligned
- clang's static analyzer has a [decent heuristic](https://github.com/llvm/llvm-project/blob/dec47b76f406242dfb9d36da4d7adfb171c71104/clang/lib/StaticAnalyzer/Checkers/PaddingChecker.cpp#L232) for laying out overly aligned members, but there are counterexamples where the heuristic doesn't work.

This web application will find all optimal layouts for a C structure by brute force, in hopes that enough varied examples can give hints into how one can
create a better algorithm for the task.
