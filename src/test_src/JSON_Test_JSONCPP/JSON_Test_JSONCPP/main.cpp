#include <iostream>
#include "../../commun.h"

using namespace std;
using namespace json;


int main(int argc, char **argv)
{
	Object json_main;

	json_main["Data"] = "DataDATA";
	json_main["ID"] = 12;

	Array json_array;

	json_array.push_back(23);
	json_array.push_back("TEMP");

	json_main["ARRAY"] = json_array;

	cout << Serialize(json_main) << endl;


	cout << "Hello wordl" << endl;

	cout << aquarius::currentDateTime() << endl;

	system("pause");

	return 0;
}