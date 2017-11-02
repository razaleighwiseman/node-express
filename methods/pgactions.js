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

var functions = {
  auth0: function(req, res){

	var username = req.body.username.toUpperCase();
	var password = req.body.password.toUpperCase();

	var user_cred = {uname: username, pwd: password};

	var user = {};

	pool.query("select * from public.auth_id_ctr('" + username + "','" + password + "')", function(err, result) {
	    if(err) {
	      return console.error('error running query', err);
	    }
		user = result.rows[0];

		if (!user) {
		  //res.json({success: false, msg: 'Authentication failed'});
		  poolcg.query("select * from public.auth_id_cgo('" + username + "','" + password + "')", function(err, result) {
		    if(err) {
		      return console.error('error running query', err);
		    }
			user = result.rows[0];

			if (!user) {
			  poolcg.query("select * from public.auth_id_lgs('" + username + "','" + password + "')", function(err, result) {
			    if(err) {
			      return console.error('error running query', err);
			    }
				user = result.rows[0];

				if (!user) {
				   res.json({success: false, msg: 'Authentication failed'});
				}
				else
				  res.json({success: true, token: user_cred, user: user});
			    });

			  }
			  else
			    res.json({success: true, token: user_cred, user: user});				
			  });
		}
		else {
		  res.json({success: true, token: user_cred, user: user});
		}
	});
  },
 
  getcontainer: function(req, res){

	var contnum = req.query.contnum.toUpperCase();

 pool.query("select cont_num, term_cd, voy_numimp, voy_numexp, voy_etaimp, voy_etaexp, dohld_agent_name, cstage_cd, sztyp_cd, opr_cd, cont_wgt, vgm_wgt, fknd_cd, ctrg_cd, comm_cd, loc_pol, loc_dest, haul_recv, haul_delv, to_char(time_in, 'DD/MM/YYYY HH24:MI') time_in, to_char(time_out, 'DD/MM/YYYY HH24:MI') time_out, time_out as tm_out, chld_sts, zb3hld_sts, khld_sts, cphld_sts, qahld_sts, qfhld_sts, qhhld_sts, qvhld_sts, dohld_sts, hzhld_sts, mode_in, mode_out, examine_stack_flg, slot_owner, reef_temp, hz_lpk, bl_num, ebkref_num, seal_agent, mtret_loc, remarks, hz_imo, hz_un, oog_flg, oog_height, oog_front, oog_back, oog_right, oog_left, bundle_top, bundle_chld from public.vew_mbl_cont where cont_num = '" + contnum +"' order by tm_out desc;", function(err, result) {
   //call `done()` to release the client back to the pool 
    //done();

    if(err) {
      return console.error('error running query', err);
    }
	res.json(result.rows);
//	console.log(result.rows[i]);
    //client.end();
  });
 },

  getvessel0: function(req, res){

        var voy_nm = req.query.voy_nm.toUpperCase();
        var search_type = req.query.search_type;

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

pool.query("select voy_num, vess_cd, voy_term, vess_name, voy_status, voy_berth, to_char(voy_eta, 'DD/MM/YYYY HH24:MI') eta, to_char(voy_gopen, 'DD/MM/YYYY') voy_gopen, to_char(voy_gcutoff, 'DD/MM/YYYY HH24:MI') voy_gcutoff, voy_opr, voy_ib, voy_ob, to_char(voy_etb, 'DD/MM/YYYY HH24:MI') voy_etb, to_char(voy_atb, 'DD/MM/YYYY HH24:MI') voy_atb, to_char(voy_etd, 'DD/MM/YYYY HH24:MI') voy_etd, to_char(voy_atd, 'DD/MM/YYYY HH24:MI') voy_atd, voy_slotowner from public.vew_mbl_voy where not vess_cd = 'WESTPORT' and " + query, function(err, result) {

    if(err) {
      return console.error('error running query', err);
    }
        res.json(result.rows);
  });
 },

  getvessel: function(req, res) {

        var voy_nm = req.query.voy_nm.toUpperCase();
        var search_type = req.query.search_type;

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

poolcg.query("select voy_num, vess_cd, voy_term, vess_name, voy_status, voy_berth, to_char(voy_eta, 'DD/MM/YYYY HH24:MI') eta, voy_eta, to_char(voy_gopen, 'DD/MM/YYYY') voy_gopen, to_char(voy_gcutoff, 'DD/MM/YYYY HH24:MI') voy_gcutoff, voy_opr, voy_ib, voy_ob, to_char(voy_etb, 'DD/MM/YYYY HH24:MI') voy_etb, to_char(voy_ata, 'DD/MM/YYYY HH24:MI') voy_ata, to_char(voy_atb, 'DD/MM/YYYY HH24:MI') voy_atb, to_char(voy_etd, 'DD/MM/YYYY HH24:MI') voy_etd, to_char(voy_atd, 'DD/MM/YYYY HH24:MI') voy_atd, voy_slotowner, vess_type from vew_mbl_voy_all where not vess_type = 'CT' and " + query, function(err, result) {

    if(err) {
      return console.error('error running query', err);
    }
        for (i = 0; i < result.rowCount; i++){
           vessels.push(result.rows[i]);
        }

        pool.query("select voy_num, vess_cd, voy_term, vess_name, voy_status, voy_berth, to_char(voy_eta, 'DD/MM/YYYY HH24:MI') eta, voy_eta, to_char(voy_gopen, 'DD/MM/YYYY') voy_gopen, to_char(voy_gcutoff, 'DD/MM/YYYY HH24:MI') voy_gcutoff, voy_opr, voy_ib, voy_ob, to_char(voy_etb, 'DD/MM/YYYY HH24:MI') voy_etb, to_char(voy_atb, 'DD/MM/YYYY HH24:MI') voy_atb, to_char(voy_ata, 'DD/MM/YYYY HH24:MI') voy_ata, to_char(voy_etd, 'DD/MM/YYYY HH24:MI') voy_etd, to_char(voy_atd, 'DD/MM/YYYY HH24:MI') voy_atd, voy_slotowner from public.vew_mbl_voy where " + query, function(err, result) {

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
	   res.json(vessels);
          });

    });

  },

  getvesselcgo: function(req, res){

        var voy_nm = req.query.voy_nm.toUpperCase();
        var search_type = req.query.search_type;

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

poolcg.query("select voy_num, vess_cd, voy_term, vess_name, voy_status, voy_berth, to_char(voy_eta, 'DD/MM/YYYY HH24:MI') eta, to_char(voy_gopen, 'DD/MM/YYYY') voy_gopen, to_char(voy_gcutoff, 'DD/MM/YYYY HH24:MI') voy_gcutoff, voy_opr, voy_ib, voy_ob, to_char(voy_etb, 'DD/MM/YYYY HH24:MI') voy_etb, to_char(voy_atb, 'DD/MM/YYYY HH24:MI') voy_atb, to_char(voy_etd, 'DD/MM/YYYY HH24:MI') voy_etd, to_char(voy_atd, 'DD/MM/YYYY HH24:MI') voy_atd, voy_slotowner from vew_mbl_voy_all where not vess_cd = 'WESTPORT' and " + query, function(err, result) {

    if(err) {
      return console.error('error running query', err);
    }
        res.json(result.rows);
  });
 },

  getvesseldate: function(req, res){

	var from = req.query.datefrom;
	var to = req.query.dateto;

pool.query("select voy_num, vess_cd, voy_term, vess_name, voy_status, voy_berth, to_char(voy_eta, 'DD/MM/YYYY HH24:MI') eta, to_char(voy_gopen, 'DD/MM/YYYY') voy_gopen, to_char(voy_gcutoff, 'DD/MM/YYYY HH24:MI') voy_gcutoff, voy_opr, voy_ib, voy_ob, to_char(voy_etb, 'DD/MM/YYYY HH24:MI') voy_etb, to_char(voy_atb, 'DD/MM/YYYY HH24:MI') voy_atb, to_char(voy_etd, 'DD/MM/YYYY HH24:MI') voy_etd, to_char(voy_atd, 'DD/MM/YYYY HH24:MI') voy_atd, voy_slotowner from public.vew_mbl_voy where not vess_cd = 'WESTPORT' and (date(voy_eta) >= '" + from + "' and date(voy_eta) <= '" + to + "') order by voy_eta desc;", function(err, result) {

    if(err) {
      return console.error('error running query', err);
    }
        res.json(result.rows);

   });
  },

  getbookingref: function(req, res){

	var booking_ref_no = req.query.booking_ref_no.toUpperCase();

pool.query("select a.ebkref_num, a.opr_cd, a.voy_numexp, '(' || b.voy_term::text || ') ' || b.vess_cd::text || '-' || b.vess_name::text voy_desc, a.loc_podexp, a.loc_dest, a.agent_cd, a.agent_name, a.slot_owner, to_char(a.voy_gopen,'DD/MM/YYYY ') voy_gopen, to_char(a.voy_gcutoff, 'DD/MM/YYYY HH24:MI') voy_gcutoff from vew_mbl_ebkref a, vew_mbl_voy b where ebkref_num='" + booking_ref_no + "' and a.voy_numexp=b.voy_num and b.vess_cd <> 'WESTPORT'", function(err, result){
   //call `done()` to release the client back to the pool
    //done();

    if(err) {
      return console.error('error running query', err);
    }
        res.json(result.rows);
  });
 },

  getbookinglist: function(req, res){
	
	var  booking_ref_no = req.query.booking_ref_no.toUpperCase();

pool.query("select * from vew_mbl_ebkref_dtl where ebkref_num='" + booking_ref_no + "'", function(err, result){
   //call `done()` to release the client back to the pool
    //done();

    if(err) {
      return console.error('error running query', err);
    }
        res.json(result.rows);
  });
 },

  getbookingcontlist: function(req, res){

	var booking_ref_no = req.query.booking_ref_no;
	var syztyp = req.query.syztyp; 
	var ctrg = req.query.ctrg;
	var status = req.query.status;
	var comm = req.query.comm;

pool.query("select ebkref_num, cont_num, haul_recv, sztyp_cd, cont_wgt, reef_temp, seal_agent, cstage_cd, chld_sts, zb3hld_sts, vgm_wgt, term_cd, voy_numimp, voy_numexp, fknd_cd, ctrg_cd, comm_cd, loc_pol, loc_dest, to_char(time_in, 'DD/MM/YYYY HH24:MI') time_in, to_char(time_out, 'DD/MM/YYYY HH24:MI') time_out, time_out as tm_out, khld_sts, cphld_sts, qahld_sts, qfhld_sts, qhhld_sts, qvhld_sts, dohld_sts, hzhld_sts, mode_in, examine_stack_flg, slot_owner, hz_lpk, hz_imo, hz_un, oog_flg, oog_height, oog_front, oog_back, oog_right, oog_left, bundle_top, bundle_chld  from vew_mbl_cont where ebkref_num='" + booking_ref_no + "' and sztyp_cd='" + syztyp + "' and ctrg_cd='" + ctrg + "' and fknd_cd='" + status + "' and comm_cd like '%" + comm + "%';", function(err, result){
   //call `done()` to release the client back to the pool
   // done();

   if(err){
     return console.error('error running query', err);
   }
	res.json(result.rows);
  });
 },

 getDepot: function(req, res) {

	var contnum = req.query.contnum.toUpperCase();

	pool.query("select cont_num, sztyp_cd, opr_cd, term_cd, ctrg_cd, cstage_cd, comm_cd, fknd_cd, cont_wgt,vgm_wgt, vess_nameimp, voy_numimp, voy_etaimp,examine_stack_flg, dohld_sts, chld_sts, dohld_agent_name, remarks from vew_mbl_cont where cont_num = '" + contnum + "' and cstage_cd in ('PACK', 'UPACK');", function(err, result) {

	  if (err) {
	    return console.error('error running query', err);
	  }

		res.json(result.rows);
	});
 },

 getNdsb: function(req, res) {

	var ctr_no = req.query.ctr_no.toUpperCase();

        poolcg.query("SELECT * FROM vew_mbl_lgs_ctr WHERE ctr_no = '" + ctr_no + "'", function(err, result) {

          if (err) {
            return console.error('error running query', err);
          }

                res.json(result.rows);

        });
	
 },

 getVgm: function(req, res) {

	var contnum = req.query.contnum.toUpperCase();

	pool.query("SELECT * FROM vew_mbl_ctr_vgm WHERE cont_num = '" + contnum  + "'", function(err, result) {

          if (err) {
            return console.error('error running query', err);
          }

                res.json(result.rows);

	});
 },

 getDepotDg: function(req, res) {

	var iidno = req.query.iidno.toUpperCase();

	poolcg.query("SELECT * FROM vew_mbl_dpt_dg WHERE iid_no = '" + iidno  + "'", function(err, result) {

          if (err) {
            return console.error('error running query', err);
          }

                res.json(result.rows);

	});
 },

 getDepotVtc: function(req, res) {
	
	var chasis_no = req.query.chasis_no.toUpperCase();

	poolcg.query("SELECT * FROM vew_mbl_dpt_vtc WHERE chasis_no = '" + chasis_no + "'", function(err, result){

          if (err) {
            return console.error('error running query', err);
          }

                res.json(result.rows);

	});

 },

 getVesselBk: function(req, res) {

	var voy_cd = req.query.voy_cd.toUpperCase();

	poolcg.query("SELECT * FROM vew_mbl_vsl_bk_wkpt WHERE voy_cd = '" + voy_cd + "'", function(err, result){

          if (err) {
            return console.error('error running query', err);
          }

                res.json(result.rows);

	});
 }

}

module.exports = functions;

