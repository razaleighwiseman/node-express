var Pool = require('pg').Pool;

//postgres config
var pgconfig = {
    user: 'mbldvc',
    database: 'np',
    password: 'mbldvc11',
    host: '10.10.202.107',
    port: '55635',
    max: '10',
    idleTimeoutMillis: '3000'
};

//db configs for conventional database
var pgcgconfig = {
    user: 'mbldvc',
    database: 'np',
    password: 'mbldvc11',
    host: '10.8.221.181',
    port: '55633',
    max: '10',
    idleTimeoutMillis: '3000'
};

var poolcg = new Pool(pgcgconfig);
//End conventional configs

var pool = new Pool(pgconfig);

        var voy_nm = '20170727';
        var search_type = 'eta';

	var vessels = [];

        var query = "";

        if (search_type === 'scn'){
                query = "voy_num = '" + voy_nm + "' order by voy_eta desc;";
        }
        else if (search_type === 'vesselId'){
                query = "vess_cd = '" + voy_nm + "' order by voy_eta desc;";
        }
        else if (search_type === 'vesselName'){
                query = "vess_name = '" + voy_nm + "' order by voy_eta desc;";
        }
        else if (search_type === 'eta'){
                query = "date(voy_eta) = '" + voy_nm + "' order by voy_eta desc;";
        }

poolcg.query("select voy_num, vess_cd, voy_term, vess_name, voy_status, voy_berth, to_char(voy_eta, 'DD/MM/YYYY HH24:MI') eta, voy_eta, to_char(voy_gopen, 'DD/MM/YYYY') voy_gopen, to_char(voy_gcutoff, 'DD/MM/YYYY HH24:MI') voy_gcutoff, voy_opr, voy_ib, voy_ob, to_char(voy_etb, 'DD/MM/YYYY HH24:MI') voy_etb, to_char(voy_atb, 'DD/MM/YYYY HH24:MI') voy_atb, to_char(voy_etd, 'DD/MM/YYYY HH24:MI') voy_etd, to_char(voy_atd, 'DD/MM/YYYY HH24:MI') voy_atd, voy_slotowner, vess_type from vew_mbl_voy_all where not vess_cd = 'WESTPORT' and not vess_type = 'CT' and " + query, function(err, result) {

    if(err) {
      return console.error('error running query', err);
    }
	for (i = 0; i < result.rowCount; i++){
	   vessels.push(result.rows[i]);
	}

	pool.query("select voy_num, vess_cd, voy_term, vess_name, voy_status, voy_berth, to_char(voy_eta, 'DD/MM/YYYY HH24:MI') eta, voy_eta, to_char(voy_gopen, 'DD/MM/YYYY') voy_gopen, to_char(voy_gcutoff, 'DD/MM/YYYY HH24:MI') voy_gcutoff, voy_opr, voy_ib, voy_ob, to_char(voy_etb, 'DD/MM/YYYY HH24:MI') voy_etb, to_char(voy_atb, 'DD/MM/YYYY HH24:MI') voy_atb, to_char(voy_etd, 'DD/MM/YYYY HH24:MI') voy_etd, to_char(voy_atd, 'DD/MM/YYYY HH24:MI') voy_atd, voy_slotowner from public.vew_mbl_voy where not vess_cd = 'WESTPORT' and " + query, function(err, result) {

	    if(err) {
	      return console.error('error running query', err);
	    }
		for (i = 0; i < result.rowCount; i++){
		   vessels.push(result.rows[i]);
		}

		vessels.sort(function(a, b) {
		    var dateA = new Date(a.voy_eta), dateB = new Date(b.voy_eta);
		    return dateB - dateA;
		});

           console.log(vessels.length);
           //console.log(vessels);
	  });

  });

