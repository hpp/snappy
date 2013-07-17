

var soundOptions = [ [], [] ], soundOptionsIdx = [ [], [] ];
var xtras = ["Download", "Browse"];

getSoundOptions(t, function(opts,idxs){
	soundOptions[t] = opts;
	//soundOptions[t] = soundOptions[t].concat(xtras);
	soundOptionsIdx[t] = idxs;
});
		
getSoundOptions(s, function(opts,idxs){
	soundOptions[s] = opts;
	//soundOptions[s] = soundOptions[s].concat(xtras);
	soundOptionsIdx[s] = idxs;
});

function soundOptionsAdd(sType, file){
    soundOptions[sType].pop();
    soundOptions[sType].pop();
    soundOptions[sType].push(file);
    //soundOptions[sType] = soundOptions[sType].concat(xtras);
}
	
