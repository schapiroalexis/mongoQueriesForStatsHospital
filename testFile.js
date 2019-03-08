//este es el archivo que anda
//adentro del docker de mongo corres:
//>mongo main testFile.js

var findProfessionals = function () {
	var listOfProfessionals = db.users.find({ type: 'medic' }, { _id: 1 });
	return listOfProfessionals;
};

var test = findProfessionals();
print('hola estoy en test2');
print(test);
printjson(test[0]);
printjson(test[5]);
print('el largo de test es = ', test.length());
findProfessionals().forEach(function(el) {
	return printjson(el);
});
