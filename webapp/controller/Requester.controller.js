sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";
	
	return Controller.extend("nextgen.nextgen.controller.RequesterView", {
		
         onMultiSelectPress: function(oEvent) {
		if (oEvent.getSource().getPressed()) {
			sap.m.MessageToast.show("MultiSelect Pressed");
		} else {
			sap.m.MessageToast.show("MultiSelect Unpressed");
		}
	},
	   onNavBack: function()
	   {
	   	history.go(-1);
	   },
	   onAddReq : function () {
			var oView = this.getView();
			var oDialog = oView.byId("helloTest");
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment( "nextgen.nextgen.view.Add",this);
				// connect dialog to view (models, lifecycle)
				oView.addDependent(oDialog);
				
			}

			oDialog.open();
		},
		dialogAfterclose: function(oEvent) {//function called after Dialog is closed
        this._oDialog.destroy();//destroy only the content inside the Dialog
		},
		confirmOk: function(oEvent) {
    this._oDialog.close();//Just close the Dialog, Dialog afterClose() will be called and destroy the Dialog content.
		},
		
		onDashboardButtonPress: function(oEvent) {
			var SplitContainer = this.byId("SplitContainer");
			SplitContainer.to(this.createId("DashboadDetailpage"))
			
		}
    
	

	});

});