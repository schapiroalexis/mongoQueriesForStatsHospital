/**
 * 1) Busqueda por profesionales: profesional XY turnos/semana conf pend
 * 2) Busqueda por especialidad : especialidad XY turnos/semana conf pend
 * 3) Busqueda por servicio: servicio XY turnos/semana conf pend
 * 
 */

//week, service, speciality, prof, status
//var query1 = {$and:[{"status":status},{"speciality":speciality}]};

printResults = function(resultToPrint) {
	print('---------------------------------------------------------------------------------');
	printjson(resultToPrint);
	print('---------------------------------------------------------------------------------');
};

//date Format = '2019-03-07T00:00:00Z'

var searchQuery = {
	status: null,
	speciality: null,
	//professionalUsername: null,
	medic_id: null,
	service: null,
	timeWindowStart: null,
	timeWindowEND: null,
	resetValues: () => {
		searchQuery.status = null;
		searchQuery.speciality = null;
		searchQuery.medic_id = null;
		searchQuery.service = null;
	}
};

if (startWindow && endWindow) {

	var searchQuery = {
		status: null,
		speciality: null,
		//professionalUsername: null,
		medic_id: null,
		service: null,
		timeWindowStart: new Date(startWindow),
		timeWindowEnd: new Date(endWindow),
		resetValues: () => {
			searchQuery.status = null;
			searchQuery.speciality = null;
			searchQuery.medic_id = null;
			searchQuery.service = null;
		}
	};
}

const services = [
	{
		code: 'demand',
		name: 'Atención a la demanda espontánea'
	},
	{
		code: 'emergency',
		name: 'Guardia'
	},
	{
		code: 'group',
		name: 'Grupo'
	},
	{
		code: 'outpatient',
		name: 'Consultorios Externos'
	},
	{
		code: 'day_hospital',
		name: 'Hospital de dia'
	},
	{
		code: 'hospitalization',
		name: 'Internación'
	},
	{
		appointments: false,
		needsConsultation: true,
		code: 'acute_hospitalization',
		name: 'Internación aguda',
		device: [ 'hospitalization' ]
	},
	{
		appointments: false,
		needsConsultation: true,
		code: 'laboratory',
		name: 'Laboratorio',
		device: [ 'complementary benefits' ]
	},
	{
		code: 'nutrition',
		name: 'Nutrición'
	},
	{
		code: 'odontology',
		name: 'Odontología'
	},
	{
		code: 'medical_clinic',
		name: 'Clínica médica'
	},
	{
		code: 'legal_assistance',
		name: 'Jurídico asistencial'
	}
];

const specialities = [
	{ code: 'social_work', name: 'Trabajo social' },
	{ code: 'Dentist', name: 'Dentista' },
	{ code: 'psychiatry', name: 'Psiquiatría' },
	{ code: 'therapeutic_companion', name: 'Acompañante Terapéutico' },
	{ code: 'psychology', name: 'Psicología' }
];

var listAllProfessionals = function() {
	var listOfProfessionals = db.users.find({ type: 'medic' }, { _id: 1, username: 1 });
	return listOfProfessionals;
};
//functioning
//listAllProfessionals().forEach(printResults);

var findFunc = function(searchParams = {}) {
	var query1 = { $and: [ {} ] };
	searchParams.medic_id ? query1['$and'].push({ medic: searchParams.medic_id }) : null;
	searchParams.status ? query1['$and'].push({ status: searchParams.status }) : null;
	searchParams.speciality ? query1['$and'].push({ speciality: searchParams.speciality }) : null;
	searchParams.service ? query1['$and'].push({ service: searchParams.service }) : null;
	searchParams.timeWindowStart && searchParams.timeWindowEnd
		? query1['$and'].push({
				date: { $gt: searchParams.timeWindowStart, $lt: searchParams.timeWindowEnd }
			})
		: null;

	// print('------------------------------------------------');
	// print('findFunc / query1 = ');
	// printjson(query1);
	// print('------------------------------------------------');
	var results = db.appointments.count(query1);
	return results;
};

//functioning
// print('----------------------------------------------');
// print('findFunc() /  =');
// findFunc().forEach(printResults);
// print('----------------------------------------------');

// SEARCH AFTER SERVICE
var listAppointmentsAfterServices = function() {
	var resultsAfterServices = [];
	services.forEach((el) => {
		searchQuery.service = el.code;
		var dummy = findFunc(searchQuery);
		var dummyObject = { service: el.name, appointments: dummy };
		resultsAfterServices.push(dummyObject);
	});
	return resultsAfterServices;
};
//listAppointmentsAfterServices();

// SEARCH AFTER PROFESSIONALS
var listAppointmentsAfterProfs = function() {
	var resultsAfterProfs = [];
	listAllProfessionals().forEach((el) => {
		searchQuery.medic_id = el._id;
		var dummy = findFunc(searchQuery);
		var dummyObject = { username: el.username, _id: el._id, appointments: dummy };
		resultsAfterProfs.push(dummyObject);
	});
	return resultsAfterProfs;
};
//var testing = listAppointmentsAfterProfs();
//printjson(testing);

//SEARCH AFTER SERVICE
var listAppointmentsAfterServices = () => {
	var resultsAfterService = [];
	services.forEach((el) => {
		searchQuery.service = el.code;
		var dummy = findFunc(searchQuery);
		var dummyObject = { service: el.code, appointments: dummy };
		resultsAfterService.push(dummyObject);
	});
	return resultsAfterService;
};

//var testing = listAppointmentsAfterServices();
//printjson(testing);

//SEARCH AFTER SPECIALITY
var listAppointmentsAfterSpecility = () => {
	var resultsAfterSpeciality = [];
	specialities.forEach((el) => {
		searchQuery.speciality = el.code;
		var dummy = findFunc(searchQuery);
		var dummyObject = { speciality: el.code, appointments: dummy };
		resultsAfterSpeciality.push(dummyObject);
	});
	return resultsAfterSpeciality;
};

//var testing = listAppointmentsAfterSpecility();
//printjson(testing);

//SEARCH AFTER STATUS
var listAppointmentsAfterStatus = () => {
	var resultsAfterStatus = { pend: 0, wait: 0, conf: 0 };
	Object.keys(resultsAfterStatus).forEach((skey) => {
		searchQuery.status = skey;
		var dummy = findFunc(searchQuery);
		resultsAfterStatus[skey] = dummy;
	});
	return resultsAfterStatus;
};

//var testing = listAppointmentsAfterStatus();
//printjson(testing);

const generalSearch = () => {
	let mainSearchResults = { professional: null, services: null, specialities: null, status: null };
	let dummyResultsArray = [];

	Object.keys(mainSearchResults).forEach((skey) => {
		switch (skey) {
			case 'professional':
				dummyResultsArray = [];
				searchQuery.resetValues();
				listAllProfessionals().forEach((el) => {
					searchQuery.medic_id = el._id;
					var dummy = findFunc(searchQuery);
					var dummyObject = { username: el.username, _id: el._id, appointments: dummy };
					dummyResultsArray.push(dummyObject);
				});
				mainSearchResults[skey] = dummyResultsArray;
				break;

			case 'services':
				searchQuery.resetValues();
				dummyResultsArray = [];
				services.forEach((el) => {
					searchQuery.service = el.code;
					var dummy = findFunc(searchQuery);
					var dummyObject = { service: el.name, appointments: dummy };
					dummyResultsArray.push(dummyObject);
				});
				mainSearchResults[skey] = dummyResultsArray;
				break;

			case 'specialities':
				dummyResultsArray = [];
				searchQuery.resetValues();
				specialities.forEach((el) => {
					searchQuery.speciality = el.code;
					var dummy = findFunc(searchQuery);
					var dummyObject = { speciality: el.code, appointments: dummy };
					dummyResultsArray.push(dummyObject);
				});
				mainSearchResults[skey] = dummyResultsArray;
				break;

			case 'status':
				searchQuery.resetValues();
				var resultsAfterStatus = { pend: 0, wait: 0, conf: 0 };
				Object.keys(resultsAfterStatus).forEach((statuskey) => {
					searchQuery.status = statuskey;
					var dummy = findFunc(searchQuery);
					resultsAfterStatus[statuskey] = dummy;
				});
				mainSearchResults[skey] = resultsAfterStatus;
				break;
		}
	});
	return mainSearchResults;
};


var testing = generalSearch();
printjson(testing);



