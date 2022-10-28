/*

	jQuery Tags Input Plugin 1.3.3
	
	Copyright (c) 2011 XOXCO, Inc
	
	Documentation for this plugin lives here:
	http://xoxco.com/clickable/jquery-tags-input
	
	Licensed under the MIT license:
	http://www.opensource.org/licenses/mit-license.php

	ben@xoxco.com

*/

(function($) {

	var delimiter = new Array();
	var tags_callbacks = new Array();

	// syntax checker
	var lexer, parseId;

	$.fn.parse = function(){
		if (parseId) {
	        window.clearTimeout(parseId);
	    }

	    parseId = window.setTimeout(function () {
	        var code, str,
	            lexer, tokens, token, i,
	            parser, syntax;
	        var $scope = angular.element($('#metric-formula')).scope();
	        code = $scope.formula_string;
	        try {
	            if (typeof lexer === 'undefined') {
	                lexer = new TapDigit.Lexer();
	            }

	            if (typeof parser === 'undefined') {
	                parser = new TapDigit.Parser();
	            }

	            tokens = [];
	            lexer.reset(code);
	            while (true) {
	                token = lexer.next();
	                if (typeof token === 'undefined') {
	                    break;
	                }
	                tokens.push(token);
	            }

	            syntax = parser.parse(code);
	            $('#metric-formula #verify').text('verified');
	            $('#metric-formula #verify').removeClass('none');
	            $('#metric-formula #verify').show();
	            
	        } catch (e) {
	            $('#metric-formula #verify').text('not verified');
	            $('#metric-formula #verify').addClass('none');
	            $('#metric-formula #verify').show();
	        }
	        parseId = undefined;
	    }, 345);
	};

	$.fn.doAutosize = function(o){
	    var minWidth = $(this).data('minwidth'),
	        maxWidth = $(this).data('maxwidth'),
	        val = '',
	        input = $(this),
	        testSubject = $('#'+$(this).data('tester_id'));
	
	    if (val === (val = input.val())) {return;}
	
	    // Enter new content into testSubject
	    var escaped = val.replace(/&/g, '&amp;').replace(/\s/g,' ').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	    testSubject.html(escaped);
	    // Calculate new width + whether to change
	    var testerWidth = testSubject.width(),
	        newWidth = (testerWidth + o.comfortZone) >= minWidth ? testerWidth + o.comfortZone : minWidth,
	        currentWidth = input.width(),
	        isValidWidthChange = (newWidth < currentWidth && newWidth >= minWidth)
	                             || (newWidth > minWidth && newWidth < maxWidth);
	
	    // Animate width
	    if (isValidWidthChange) {
	        input.width(newWidth);
	    }


  };
  $.fn.resetAutosize = function(options){
    // alert(JSON.stringify(options));
    var minWidth =  $(this).data('minwidth') || options.minInputWidth || $(this).width(),
        maxWidth = $(this).data('maxwidth') || options.maxInputWidth || ($(this).closest('.tagsinput').width() - options.inputPadding),
        val = '',
        input = $(this),
        testSubject = $('<tester/>').css({
            position: 'absolute',
            top: -9999,
            left: -9999,
            width: 'auto',
            fontSize: input.css('fontSize'),
            fontFamily: input.css('fontFamily'),
            fontWeight: input.css('fontWeight'),
            letterSpacing: input.css('letterSpacing'),
            whiteSpace: 'nowrap'
        }),
        testerId = $(this).attr('id')+'_autosize_tester';
    if(! $('#'+testerId).length > 0){
      testSubject.attr('id', testerId);
      testSubject.appendTo('body');
    }

    input.data('minwidth', minWidth);
    input.data('maxwidth', maxWidth);
    input.data('tester_id', testerId);
    input.css('width', minWidth);
  };
  
	$.fn.addTag = function(value,options, index) {
			options = jQuery.extend({focus:false,callback:true},options);
			var parent = $(this);
			this.each(function() { 
				var id = $(this).attr('id');
				

				var tagslist = $(this).val().split(delimiter[id]);
				if (tagslist[0] == '') { 
					tagslist = new Array();
				}

				value = jQuery.trim(value);
		
				if (options.unique) {
//					var skipTag = $(this).tagExist(value);
					if(skipTag == true) {
					    //Marks fake input as not_valid to let styling it
    				    $('#'+id+'_tag').addClass('not_valid');
    				}
				} else {
					var skipTag = false; 
				}
				if (value !='' && skipTag != true) { 
                    var languages = ['Watt', 'Wh', 'maxW', 'minW', 'Ee', 'F', 'I', 'PQ', 'Pa', 'Qv', 'Q', 'R', 'S', 'THD', 'T', 'V', '#', '$', 'a', 'h', 'v'];
                    if(value.indexOf('@') > 0) {
                    	var metric_array = value.split('@');
                    	var metric = metric_array[0];
                    } else {
                    	var metric = value;
                    }
                    if(languages.indexOf(metric) >= 0) {
                		if(value.indexOf('@') > 0) {
                			var metric_array = value.split('@');
                			$('<span>').addClass('tag special').attr('data-index', index).append(
		                        $('<span class="metric">').text(metric_array[0]).append(' ').prepend('<img class="formula-img" src="/assets/img/icon-formula.png" style="margin-right: 5px"/>'),
		                        $('<a>', {
		                            href  : '#',
		                            class  : 'remove-metric',
		                            title : 'Removing tag',
		                            text  : 'x'
		                        }).click(function () {
		                            return $('#' + id).removeTag(index);
		                        }),
		                        $('<span>').addClass('clock').text(metric_array[1])
		                    ).insertBefore('#' + id + '_addTag');
                		} else {
                			$('<span>').addClass('tag special').attr('data-index', index).append(
		                        $('<span class="metric">').text(value).append(' ').prepend('<img class="formula-img" src="/assets/img/icon-formula.png" style="margin-right: 5px"/>'),
		                        $('<a>', {
		                            href  : '#',
		                            class  : 'remove-metric',
		                            title : 'Removing tag',
		                            text  : 'x'
		                        }).click(function () {
		                            return $('#' + id).removeTag(index);
		                        }),
		                        $('<span>').addClass('clock').append(
		                        	$('<img src="/assets/img/icon-clock.png"/>'),
		                        	$('<div class="clock-block">').append(
		                        		$('<span>Each</span>'),
		                        		$('<input type="text" id="trailing_value" class="form-control trailing_value"/>'),
		                        		$('<select id="interval_type" class="form-control interval_type"><option value="s">Seconds</option><option value="m">Minutes</option><option value="h">Hours</option><option value="d">Days</option><option value="w">Weeks</option><option value="M">Months</option><option value="y">Years</option></select>'),
		                        		$('<a href="#" class="apply-interval">Apply</button></a>').click(function () {
				                            if ($(this).parent().find('#trailing_value').val() == '')
				                            	return false;
				                            $(this).parent().find('#clock-value').focus();
											var clock_value = $(this).parent().find('#trailing_value').val() + $(this).parent().find('#interval_type').val();
											$(this).parents('.clock').find('img').remove();
											$(this).parents('.clock').text(clock_value);
											var new_value = value + '@' + clock_value;
											console.log('parent value');
											console.log(parent.val());
											var tag_array = parent.val().split(delimiter[id]);
											tag_array.splice(index, 1, new_value);
											$.fn.tagsInput.updateTagsField(parent,tag_array);
											$('#'+id+'_tagsinput .tag').remove();
											$.fn.tagsInput.importTags(parent,parent.val());
				                        })
		                        	).mouseleave(function () {
			                            $(this).hide();
			                        })
		                        ).click(function () {
		                            var dim = $(this).offset().left - $('#add_metric_formula_tagsinput').offset().left;
									if (dim > 250) {
		                        		$(this).find('.clock-block').css('right', '-50px');
		                            } else {
		                            	$(this).find('.clock-block').css('right', '-110px');
		                            } 

		                            $(this).find('.clock-block').show();
		                        })
		                    ).insertBefore('#' + id + '_addTag');
                		}
  						/*
                		$('<span>').addClass('tag special').attr('data-index', index).append(
	                        $('<span class="metric">').text(value).append(' ').prepend('<img class="formula-img" src="images/management/companyPanel/icon-formula.png"/>&nbsp;&nbsp;'),
	                        $('<a>', {
	                            href  : '#',
	                            class  : 'remove-metric',
	                            title : 'Removing tag',
	                            text  : 'x'
	                        }).click(function () {
	                            return $('#' + id).removeTag(index);
	                        })
	                    ).insertBefore('#' + id + '_addTag');
					*/
                	} else {
                		$('<span>').addClass('tag').attr('data-index', index).append(
	                        $('<span class="metric">').text(value).append(' '),
	                        $('<a>', {
	                            href  : '#',
	                            class  : 'remove-metric',
	                            title : 'Removing tag',
	                            text  : 'x'
	                        }).click(function () {
	                            return $('#' + id).removeTag(index);
	                        })
	                    ).insertBefore('#' + id + '_addTag');
                	} 


                    if(tagslist.length <= index)
						tagslist.push(value);
					else {
						tagslist.splice(index, 0, value);
						var i = 0;
						$('.tag' , '#' + id + '_tagsinput').each(function (){
							$(this).attr('data-index', i);
							i++;
						})
					}
				
					$('#'+id+'_tag').val('');
					if (options.focus) {
						$('#'+id+'_tag').focus();
					} else {		
						$('#'+id+'_tag').blur();
					}
					
					$.fn.tagsInput.updateTagsField(this,tagslist);
					
					if (options.callback && tags_callbacks[id] && tags_callbacks[id]['onAddTag']) {
						var f = tags_callbacks[id]['onAddTag'];
						f.call(this, value);
					}

					if(tags_callbacks[id] && tags_callbacks[id]['onChange'])
					{
						var i = tagslist.length;
						var f = tags_callbacks[id]['onChange'];
						f.call(this, $(this), tagslist[i-1]);
					}					
				}

		
			});
			return false;
		};
		
	$.fn.removeTag = function(value) { 
			value = unescape(value);
			this.each(function() { 
				var id = $(this).attr('id');
				
				var old = $(this).val().split(delimiter[id]);
				old.splice(value, 1);
				$('#'+id+'_tagsinput .tag').remove();
				str = '';
				for (i=0; i< old.length; i++) { 
					if(str == '') {
						str = str +old[i];
					}
					else str = str + delimiter[id] +old[i];
				}
				
				$.fn.tagsInput.importTags(this,str);

				if (tags_callbacks[id] && tags_callbacks[id]['onRemoveTag']) {
					var f = tags_callbacks[id]['onRemoveTag'];
					f.call(this, value);
				}

			});
			return false;
		};

	$.fn.sortTag = function() { 
			var id = $(this).attr('id');
			str = '';
			$('#'+id+'_tagsinput .tag').each(function() {
				var tage_value;
				if($(this).find('.clock').length > 0) {
					if($(this).find('.clock img').length > 0) {
						tage_value = $(this).find('.metric').text().trim();
					} else {
						tage_value = $(this).find('.metric').text().trim() + '@' + $(this).find('.clock').text().trim();
					}
					
				} else {
					tage_value = $(this).find('.metric').text().trim();
				}
				
				if(str == '') {
					str = str + tage_value;
				}
				else str = str + delimiter[id] + tage_value;
			});
			$('#'+id+'_tagsinput .tag').remove();
			$.fn.tagsInput.importTags(this,str);
		};
	
	$.fn.tagExist = function(val) {
		var id = $(this).attr('id');
		var tagslist = $(this).val().split(delimiter[id]);
		return (jQuery.inArray(val, tagslist) >= 0); //true when tag exists, false when not
	};
	
	// clear all existing tags and import new ones from a string
	$.fn.importTags = function(str) {
        id = $(this).attr('id');
		$('#'+id+'_tagsinput .tag').remove();
		$.fn.tagsInput.importTags(this,str);
	}
		
	$.fn.tagsInput = function(options) { 
    var settings = jQuery.extend({
      interactive:true,
      defaultText:'add a tag',
      minChars:0,
      width:'300px',
      height:'100px',
      autocomplete: {selectFirst: false },
      'hide':true,
      'delimiter':',',
      'unique':true,
      removeWithBackspace:true,
      placeholderColor:'#666666',
      autosize: true,
      comfortZone: 20,
      inputPadding: 6*2
    },options);

		this.each(function() { 
			if (settings.hide) { 
				$(this).hide();				
			}
			var id = $(this).attr('id');
			if (!id || delimiter[$(this).attr('id')]) {
				id = $(this).attr('id', 'tags' + new Date().getTime()).attr('id');
			}
			
			var data = jQuery.extend({
				pid:id,
				real_input: '#'+id,
				holder: '#'+id+'_tagsinput',
				input_wrapper: '#'+id+'_addTag',
				fake_input: '#'+id+'_tag',
				metric_div: '#'+id+'_metric',
				add_metric: '#'+id+'_addMetric'
			},settings);
	
			delimiter[id] = data.delimiter;
			
			if (settings.onAddTag || settings.onRemoveTag || settings.onChange  || settings.onSortTag) {
				tags_callbacks[id] = new Array();
				tags_callbacks[id]['onAddTag'] = settings.onAddTag;
				tags_callbacks[id]['onRemoveTag'] = settings.onRemoveTag;
				tags_callbacks[id]['onChange'] = settings.onChange;
				tags_callbacks[id]['onSortTag'] = settings.onSortTag;
			}
	
			var markup = '<div id="'+id+'_tagsinput" class="tagsinput"><div id="'+id+'_addTag" class="addtag"><div id="'+id+'_addMetric" class="addMetric">' + settings.defaultText + '</div>';
			

			if (settings.interactive) {
				markup = markup + '<input id="'+id+'_tag" value="" style="width: 30px !important; height: 25px; border: 0;"/>';
			}

			// Dima work
//			markup = markup + '<div id="'+id+'_metric" class="metric-block"><ul><li ng-repeat="metric in current_node.metrics" ng-click="addTagToFormula(metric)">{{metric.metricName}}</li><li data-value="Watt" data-set="standard">Watts (Power)</li><li data-value="Wh" data-set="standard">Watt-Hours</li><li data-value="maxW" data-set="standard">Max Watts</li><li data-set="standard" data-value="minW">Min Watts</li><li data-set="standard" data-value="Ee">Irradiance</li><li data-set="standard" data-value="F">Frequency</li><li data-set="standard" data-value="I">Current</li><li data-set="standard" data-value="PQ">Reactive Power</li><li data-set="standard" data-value="Pa">Pressure</li><li data-set="standard" data-value="Qv">Volumetric Flow</li><li data-set="standard" data-value="Q">Mass-Flow</li><li data-set="standard" data-value="R">Resistance</li><li data-set="standard" data-value="S">Apparent Power</li><li data-set="standard" data-value="THD">Total Harmonic Distortion</li><li data-set="standard" data-value="T">Temperature</li><li data-set="standard" data-value="V">Voltage</li><li data-set="standard" data-value="#">Numeric</li><li data-set="standard" data-value="$">Monetary</li><li data-set="standard" data-value="a">Angle</li><li data-set="standard" data-value="h">Relative Humidity</li><li data-set="standard" data-value="v" class="last">Speed</li></ul></div>';
			markup = markup + '<div id="'+id+'_metric" class="metric-block"><ul><li ng-repeat="metric in current_node.metrics" ng-click="addTagToFormula(metric)">{{metric.metricName}}</li></ul></div>';
			markup = markup + '</div><div class="tags_clear"></div></div>';
			markup = markup + '<span class="verify" id="verify"></span>';
			
			$(markup).insertAfter(this);

//			$(data.holder).css('height','100%');
	
			if ($(data.real_input).val()!='') { 
				$.fn.tagsInput.importTags($(data.real_input),$(data.real_input).val());
			}		
			if (settings.interactive) { 
				$(data.fake_input).val($(data.fake_input).attr('data-default'));
				$(data.fake_input).css('color',settings.placeholderColor);
		        $(data.fake_input).resetAutosize(settings);
				/*
				$(data.holder).bind('click',data,function(event) {
					$(event.data.fake_input).focus();
				});
				*/
				// Dima work
				$(data.holder).sortable({
					stop: function (event) {
					    $(data.real_input).sortTag();
					}
				});
				$(data.add_metric).bind('click',data,function(event) {
					$(event.data.metric_div).show();
					$(event.data.fake_input).focus();
				});
				
				$(data.input_wrapper).bind('mouseleave',data,function(event) {
					$(event.data.metric_div).hide();
				});
				$(data.fake_input).bind('focus',data,function(event) {
					if ($(event.data.fake_input).val()==$(event.data.fake_input).attr('data-default')) { 
						$(event.data.fake_input).val('');
					}
					$(event.data.fake_input).css('color','#000000');		
				});
						
				if (settings.autocomplete_url != undefined) {
					autocomplete_options = {source: settings.autocomplete_url};
					for (attrname in settings.autocomplete) { 
						autocomplete_options[attrname] = settings.autocomplete[attrname]; 
					}
				
					if (jQuery.Autocompleter !== undefined) {
						$(data.fake_input).autocomplete(settings.autocomplete_url, settings.autocomplete);
						$(data.fake_input).bind('result',data,function(event,data,formatted) {
							if (data) {
								$('#'+id).addTag(data[0] + "",{focus:true,unique:(settings.unique)});
							}
					  	});
					} else if (jQuery.ui.autocomplete !== undefined) {
						$(data.fake_input).autocomplete(autocomplete_options);
						$(data.fake_input).bind('autocompleteselect',data,function(event,ui) {
							$(event.data.real_input).addTag(ui.item.value,{focus:true,unique:(settings.unique)});
							return false;
						});
					}
				
					
				} else {
						// if a user tabs out of the field, create a new tag
						// this is only available if autocomplete is not used.

						// Dima Workd
						
						/*
						$(data.metric_div).find('li').bind('click',data,function(event) { 
							var last_index = parseInt($(data.input_wrapper).prev().attr('data-index')) + 1;
							var martric_value = $(this).attr('data-value');
							$(event.data.real_input).addTag(martric_value ,{focus:true,unique:(settings.unique)}, last_index);
					    });
						*/
						$(data.fake_input).bind('blur',data,function(event) {
							var operator = $(event.data.fake_input).val();
							var regexObj = /[^a-zA-Z@]/; 
							if (!regexObj.test(operator))
								return false;
							var last_index = parseInt($(data.input_wrapper).prev().attr('data-index')) + 1;
							var d = $(this).attr('data-default');
							if ($(event.data.fake_input).val()!='' && $(event.data.fake_input).val()!=d) { 
								if( (event.data.minChars <= $(event.data.fake_input).val().length) && (!event.data.maxChars || (event.data.maxChars >= $(event.data.fake_input).val().length)) ) {
									$(event.data.real_input).addTag($(event.data.fake_input).val(),{focus:true,unique:(settings.unique)}, last_index);
								}

							} else {
								$(event.data.fake_input).val($(event.data.fake_input).attr('data-default'));
								$(event.data.fake_input).css('color',settings.placeholderColor);
							}
							return false;
						});
				
				}
				// if user types a comma, create a new tag
				/*
				$(data.fake_input).bind('keypress',data,function(event) {
					if (event.which==event.data.delimiter.charCodeAt(0) || event.which==13 ) {
					    event.preventDefault();
						if( (event.data.minChars <= $(event.data.fake_input).val().length) && (!event.data.maxChars || (event.data.maxChars >= $(event.data.fake_input).val().length)) )
							$(event.data.real_input).addTag($(event.data.fake_input).val(),{focus:true,unique:(settings.unique)});
					  	$(event.data.fake_input).resetAutosize(settings);
						return false;
					} else if (event.data.autosize) {
			            $(event.data.fake_input).doAutosize(settings);
            
          			}
				});
				*/
				//Delete last tag on backspace
				data.removeWithBackspace && $(data.fake_input).bind('keydown', function(event)
				{
					if(event.keyCode == 8 && $(this).val() == '')
					{
						 event.preventDefault();
						 var last_tag = $(this).closest('.tagsinput').find('.tag:last').text();
						 var id = $(this).attr('id').replace(/_tag$/, '');
						 last_tag = last_tag.replace(/[\s]+x$/, '');
						 $('#' + id).removeTag(escape(last_tag));
						 $(this).trigger('focus');
					}
				});
				$(data.fake_input).blur();
				
				//Removes the not_valid class when user changes the value of the fake input
				if(data.unique) {
				    $(data.fake_input).keydown(function(event){
				        if(event.keyCode == 8 || String.fromCharCode(event.which).match(/\w+|[áéíóúÁÉÍÓÚñÑ,/]+/)) {
				            $(this).removeClass('not_valid');
				        }
				    });
				}
			} // if settings.interactive
		});
			
		return this;
	
	};
	
	$.fn.tagsInput.updateTagsField = function(obj,tagslist) { 
		var id = $(obj).attr('id');
		$(obj).val(tagslist.join(delimiter[id]));
		var $scope = angular.element($('#metric-formula')).scope();
		var metric_array = [], formula_array = [], string_array = [];
		$.each(tagslist, function(idx, tag) {
			if(tag.indexOf('@') > 0) {
				var int_interval = 0;
            	var tag_array = tag.split('@');
            	var trailing_value = tag_array[1];
            	var string_length = trailing_value.length;
            	var interval_type = trailing_value.substr(-1);
            	var interval_value = trailing_value.substr(0, string_length-1);
            	switch(interval_type) {
            		case 's': 
            			int_interval = parseInt(interval_value);
            			break; 
            		case 'm': 
            			int_interval = parseInt(interval_value) * 60;
            			break;
            		case 'h': 
            			int_interval = parseInt(interval_value) * 3600;
            			break; 
            		case 'd': 
            			int_interval = parseInt(interval_value) * 3600 * 24;
            			break; 
            		case 'w': 
            			int_interval = parseInt(interval_value) * 3600 * 24 * 7;
            			break; 
            		case 'M': 
            			int_interval = parseInt(interval_value) * 3600 * 24 * 30;
            			break; 
            		case 'y': 
            			int_interval = parseInt(interval_value) * 3600 * 24 * 365;
            			break;  
            	}
            	var new_tag = tag_array[0] + '.time:' + int_interval + ':';
            	metric_array.push(new_tag);
            	formula_array.push(tag_array[0]);
            	string_array.push(tag.replace('@', ' '));
            } else {
            	metric_array.push(tag);
                formula_array.push(tag);
                string_array.push(tag);
            }
        });
		$scope.node_metrics = metric_array.join(' ');
		$scope.formula_string = formula_array.join(' ');
		$scope.taglists = formula_array;
		$scope.metric_formula = string_array.join(' ');
		$.fn.parse();
	};
	
	$.fn.tagsInput.importTags = function(obj,val) {			
		$(obj).val('');
		var id = $(obj).attr('id');
		var tags = val.split(delimiter[id]);
		for (i=0; i<tags.length; i++) { 
			$(obj).addTag(tags[i],{focus:false,callback:true}, i);
		}
		if(tags_callbacks[id] && tags_callbacks[id]['onChange'])
		{
			var f = tags_callbacks[id]['onChange'];
			f.call(obj, obj, tags[i]);
		}
		$.fn.tagsInput.updateTagsField(obj, tags);
	};

})(jQuery);
