#include "commun.h"

bool exists_test(string name) {
    ifstream f(name);
    if (f.good()) {
        f.close();
        return true;
    } else {
        f.close();
        return false;
    }   
}