/*
 * JavaScript file for the application to demonstrate
 * using the API
 */

// Create the namespace instance
let ns = {};
// Create the model instance
ns.model = (function() {
    'use strict';

    let $event_pump = $('body');

    // Return the API
    return {
        'predictSale': function(rate, sale1, sale2) {
            let ajax_options = {
                type: 'GET',
                url: 'api/v1/sales_forecast/sale',
                data: 'rate='+rate +'&sale1='+sale1 +'&sale2='+sale2,
                contentType: "application/json; charset=utf-8",
                accepts: 'application/json',
                dataType: 'json',
                
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_predictSale_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        }
    };
}());

// Create the view instance
ns.view = (function() {
    'use strict';
    
    let $predicted_data_para = $(".predicted_data_para");
    return {
        updateMessage: function(predicted_data) {
            $predicted_data_para.html("Predicted sale for the third month is $" + predicted_data['predicted_sale']);
        },
        error: function(error_msg) {
            if(error_msg=="Wrong type, expected 'number' for query parameter 'rate'")
                $predicted_data_para.html("Error: Please enter a valid number in 'rate' field")
            else if(error_msg=="Wrong type, expected 'number' for query parameter 'sale1'")
                $predicted_data_para.html("Error: Please enter a valid number in 'sales in first month' field")
            else if(error_msg=="Wrong type, expected 'number' for query parameter 'sale2'")
                $predicted_data_para.html("Error: Please enter a valid number in 'sales in second month' field")
        }
    };
}());

// Create the controller
ns.controller = (function(m, v) {
    'use strict';

    let model = m,
        view = v,
        $event_pump = $('body'),
        $predicted_data_para = $(".predicted_data_para");

    // Validate input
    function validate(rate, sale1, sale2) {
        return sale1 !== "" && sale2 !== "" && rate !== "";
    }

    $(".predict-btn").click(function(e) {
        $predicted_data_para.html("")
    	e.preventDefault();
    	let rate = $("#rate_field").val(),
        sale1 = $("#sale1_field").val(),
    	sale2 = $("#sale2_field").val();
        
    	if (validate(rate, sale1, sale2)) {
            model.predictSale(rate, sale1, sale2)
        } else {
            if(rate==="")
                $predicted_data_para.html('Error: "rate" Field cannot be blank');
            else if(sale1==="")
                $predicted_data_para.html('Error: "sales in first month" Field cannot be blank');
            else if(sale2==="")
                $predicted_data_para.html('Error: "sales in second month" Field cannot be blank');
        }

    });

    // Handle the model events
    $event_pump.on('model_predictSale_success', function(e, data) {
        view.updateMessage(data);
    });

    $event_pump.on('model_error', function(e, xhr, textStatus, errorThrown) {
        let error_msg = textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        view.error(xhr.responseJSON.detail);
        console.log(error_msg);
    })

}(ns.model, ns.view));
