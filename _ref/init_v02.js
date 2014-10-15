
var presidenteEstados = "http://apuracao-eleicoes2014.r7.com/143/1?page=1&items=3"
var outrosEstados = "http://apuracao-eleicoes2014.r7.com/143/3?page=1&items=3"


var IE = document.all?true:false
var listenerIEX, listenerIEY;

jQuery(function($){
    var r = Raphael('mapPresidente', 990, 480);
    r.safari();
    var _label = r.popup(50, 50, "").hide();
    attributes = {
            fill: '#cdcccc',
            stroke: '#FFFFFF',
            'stroke-width': 1.1,
            'stroke-linejoin': 'round'
        },
    arr = new Array();
    
    $.ajax({
        url:presidenteEstados,
        cache:true,
        dataType: 'jsonp', 
        jsonpCallback: 'eleicoes2014_tempo_real',
        success: function(data){
            var tooltip = document.getElementById('tooltip');
            var seta = document.getElementById('conteinerSeta');
            var arrPartidos = ["PT","PSDB","PSB","DEM","PCDOB","PCB","PCO","PDT","PEN","PHS","PMDB","PMN","PP","PPL","PPS","PR","PRB","PROS","PRP","PRTB","PSB","PSC","PSD","PSDB","PSDC","PSL", "PSOL","PSTU", "PTDOB","PTB","PTC","PTN","PV"]
            var arrAbas = [
                {_id:"abaPres",     _target:"presidente"},
                {_id:"abaGov",      _target:"outrosCandidatos"},
                {_id:"abaSen",      _target:"outrosCandidatos"},
                {_id:"abaDepFed",   _target:"outrosCandidatos"},
                {_id:"abaDepEst",   _target:"outrosCandidatos"}
            ]

            for(var i = 0, lim = arrAbas.length; i < lim; i++){
                var obj = document.getElementById(arrAbas[i]._id)
                obj._pos = i;
                obj.onclick = function(){
                    for(var j = 0, limJ = arrAbas.length; j < limJ; j++){
                        $("#" + arrAbas[j]._id).removeClass('selecionada');
                        $("#" + arrAbas[j]._id).addClass('deselecionada');
                        var obj = document.getElementById(arrAbas[j]._target);
                        document.getElementById(arrAbas[j]._target).style.display='none';
                    }
                    document.getElementById(arrAbas[this._pos]._target).style.display='block'
                    TweenLite.to("#" + arrAbas[this._pos]._target, .3, {css:{alpha:1}})

                    switch(this.id){
                        case "abaGov":
                            outrosEstados = "http://apuracao-eleicoes2014.r7.com/143/3?page=1&items=3"
                        break;
                        case "abaSen":
                            outrosEstados = "http://apuracao-eleicoes2014.r7.com/143/5?page=1&items=3"
                        break;
                        case "abaDepFed":
                            outrosEstados = "http://apuracao-eleicoes2014.r7.com/143/6?page=1&items=3"
                        break;
                        case "abaDepEst":
                            outrosEstados = "http://apuracao-eleicoes2014.r7.com/143/7?page=1&items=3"
                        break;
                    }
                    $.ajax({
                        url:outrosEstados,
                        cache:true,
                        dataType: 'jsonp', 
                        jsonpCallback: 'eleicoes2014_geral',
                        success:function(data){
                           //tooltip.innerHTML = data;
                            for (var country in paths) {
                               var obj = r.path(paths[country].path);
                               obj.mouseover(function(){
                                console.log(this);
                               }) 
                            }
                        }
                    })
                    $(this).addClass('selecionada')
                    $(this).removeClass('deselecionada')
                }
            }

            for (var country in paths) {
                var obj = r.path(paths[country].path);
                obj.estado = country
                arr[obj.id] = country;
                //arr[obj.info] = paths[country].info
                obj.info = paths[country].info
                obj.attr(attributes);
                obj.mouseover(function(){
                    this.animate({
                        fill: '#c75252'
                    }, 300);
                    
                    if(data.locations[String(this.estado).toUpperCase()].partial == null){
                        tooltip.innerHTML = "Apurações ainda não começaram";
                    }else if(data.locations[String(this.estado).toUpperCase()].partial.secoesTotalizadas == 0){
                        tooltip.innerHTML = "Apurações ainda não começaram";
                    }else{
                        var secTot = data.locations[String(this.estado).toUpperCase()].partial.secoesTotalizadas;  
                        var secNTot = data.locations[String(this.estado).toUpperCase()].partial.secoesNaoTotalizadas;
                        var contaSec = ( (secTot + secNTot) /secTot) * 100;
                        tooltip.innerHTML = 
                        '<h1>' + this.info + '</h1>'
                        +'<div class="urnasApuradas">' + contaSec + '% URNAS APURADAS</div>'
                        
                        for(var i =0, lim = data.locations[String(this.estado).toUpperCase()].candidates.length; i <lim; i++){
                            tooltip.innerHTML += 
                            '<div class="candidatoApuracao">'
                                +'<div class="bolinhaApuracaoEstadual ' + data.locations[String(this.estado).toUpperCase()].candidates[i].partido +'" id="bolinhaApuracao' + (i+1) +  '">'
                                +   Math.round(  (data.locations[String(this.estado).toUpperCase()].candidates[i].totalVotos /(secTot + secNTot)) * 100 )
                                +'%</div>'
                                +'<div class="candidatoApuracaoEstadual">'
                                +        'Presidente<br>'
                                +         data.locations[String(this.estado).toUpperCase()].candidates[i].nomeUrna+' <span>'+ data.locations[String(this.estado).toUpperCase()].candidates[i].partido +'</span>'
                                +'</div>'
                                +'<div class="quantdadeVotosApuracaoEstadual">'
                                +   data.locations[String(this.estado).toUpperCase()].candidates[i].totalVotos+'<br>'
                                +'    votos'
                                +'</div>'
                            +'</div>'
                            +'<div class="clear"></div>'
                        }
                    }
                    if(!IE){
                        //Seleciona os estados que devem trocar a cor do texto (ou não)
                        switch(arr[this.id]) {
                            case "rn":
                            case "ac":
                            case "df":
                            case "pb":
                            case "pe":
                            case "al":
                            case "se":
                            case "rj":
                            case "es":
                                document.getElementById(arr[this.id]).style.color = "#464646";
                            break;
                            default:
                                document.getElementById(arr[this.id]).style.color = "#FFF";
                            break;
                        }
                    }
                })
                obj.mousemove(function(e){
                    if(IE){
                        listenerIEX = e.clientX;
                        listenerIEY = e.clientY;
                    }else{
                        listenerIEX = e.pageX;
                        listenerIEY = e.pageY;
                    }
                    tooltip.style.display = "block";
                    seta.style.display = "block";
                    TweenLite.to("#tooltip", .3, {css:{alpha:1,left:listenerIEX+24, top:listenerIEY - 66 - tooltip.offsetHeight}})
                    TweenLite.to("#conteinerSeta", .3, {css:{alpha:1,left:listenerIEX+5, top:listenerIEY - 80}})

                })
                obj.mouseout(function(){
                    this.animate({
                        fill: attributes.fill
                    }, 300);
                    document.getElementById(arr[this.id]).style.color = "#464646";
                    TweenLite.to("#tooltip", .3, {css:{alpha:0}, onComplete:function(){
                        tooltip.style.display='none'
                    }})
                    TweenLite.to("#conteinerSeta", .3, {css:{alpha:0}, onComplete:function(){
                        seta.style.display='none'
                    }})
                    _label.hide();
                })
            }
        }
    })
});
jQuery.expr[':'].raph=function
(objNode,intStackIndex,arrProperties,arrNodeStack){var c=objNode.getAttribute('class');return(c&&c.indexOf(arrProperties[3])!=-1);}