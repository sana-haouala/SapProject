sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/Filter',
	'sap/ui/model/json/JSONModel',
	"sap/ui/core/util/MockServer",
	"sap/ui/model/BindingMode",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/json/JSONModel"
], function(jQuery, Controller, Filter, JSONModel, MockServer, BindingMode, ODataModel ) {
	"use strict";

	return Controller.extend("nextgen.nextgen.controller.master", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf nextgen.nextgen.view.master
		 */
		onInit: function() {
			this.oModel = new JSONModel();
			this.oModel.loadData("model/Requests.json");
			this.getView().setModel(this.oModel);

			this.aKeys = ["Date", "Category", "Priority"];
			this.oSelectName = this.getSelect("slDate");
			this.oSelectCategory = this.getSelect("slCategory");
			this.oSelectPriority = this.getSelect("slPriority");
	 	this.oModel.setProperty("/Filter/text", "Filtered by None");
	 	
		//	this.addSnappedLabel();
		/*	var oMockServer = new MockServer({
				rootUri: "nextgen.master/"
			});
			oMockServer.simulate("nextgen/webapp/mockserver/metadata.xml",
				"nextgen/webapp/mockserver/");
			oMockServer.start();
			var oModel = new ODataModel("nextgen.Requester");

			oModel.setDefaultBindingMode(BindingMode.TwoWay);
			var oView = this.getView();
			oView.setModel(oModel);

			oView.byId("idSmartMultiInput1").bindElement("/Products('1')");
			oView.byId("idSmartMultiInput1").bindProperty("value", {
				path: "to_Categories/CategoryId"
			});

			oView.byId("idSmartMultiInput2").bindElement("/Products('2')");
			oView.byId("idSmartMultiInput2").bindProperty("value", {
				path: "to_Categories/CategoryId",
				mode: "OneWay"
			});

			oView.byId("idSmartMultiInput3").bindElement("/Products('3')");
			oView.byId("idSmartMultiInput3").bindProperty("value", {
				path: "to_Categories/CategoryId",
				mode: "OneTime"
			});

			oView.byId("idSmartMultiInput4").bindElement("/Products('1')");
			oView.byId("idSmartMultiInput4").attachBeforeCreate(function (oEvent) {
				var oData = oEvent.getParameter("oData"); // parameter oData for sap.ui.model.odata.v2.ODataModel.create call
				var mParameters = oEvent.getParameter("mParameters"); // parameter mParameters for sap.ui.model.odata.v2.ODataModel.create call (success and error will be overriden by SmartMultiInput)

				// if SmartMultiInput is bound against non key entity property
				// key property has to be add either here in beforeCreate event or backend has to handle it
				oData.CategoryId = Math.random().toString().slice(2, 6);

				// other parameters can be add or edit as well
				oData.Description = "custom description";
			});

			oView.byId("idSmartMultiInput5").bindElement("/Products('1')");

			var oUtilModel = new JSONModel({
				deferred: false
			});
			oView.setModel(oUtilModel, "util");
			oModel.setChangeGroups({
				"Category": {
					groupId: "testgroupid"
				}
			});*/
		},
		
		onSelect: function (oEvent) {
			var bDeferred = oEvent.getParameter("selected"),
				oModel = this.getView().getModel(),
				aDeferredGroups = oModel.getDeferredGroups();

			if (bDeferred) {
				aDeferredGroups = aDeferredGroups.concat(["testgroupid"]);
			} else {
				aDeferredGroups = aDeferredGroups.slice(0, aDeferredGroups.length - 1);
			}

			oModel.setDeferredGroups(aDeferredGroups);
			oModel.submitChanges();

		},

		onExit: function() {
			this.aKeys = [];
			this.aFilters = [];
			this.oModel = null;
		},
		onToggleHeader: function() {
			this.getPage().setHeaderExpanded(!this.getPage().getHeaderExpanded());
		},

		onSelectChange: function() {
			var aCurrentFilterValues = [];

			aCurrentFilterValues.push(this.getSelectedItemText(this.oSelectName));
			aCurrentFilterValues.push(this.getSelectedItemText(this.oSelectCategory));
			aCurrentFilterValues.push(this.getSelectedItemText(this.oSelectPriority));

			this.filterTable(aCurrentFilterValues);
		},
		filterTable: function(aCurrentFilterValues) {
			this.getTableItems().filter(this.getFilters(aCurrentFilterValues));
			this.updateFilterCriterias(this.getFilterCriteria(aCurrentFilterValues));
		},

		updateFilterCriterias: function(aFilterCriterias) {
			this.removeSnappedLabel(); /* because in case of label with an empty text, */
			this.addSnappedLabel(); /* a space for the snapped content will be allocated and can lead to title misalignment */
			this.oModel.setProperty("/Filter/text", this.getFormattedSummaryText(aFilterCriterias));
		},

		addSnappedLabel: function() {
			var oSnappedLabel = this.getSnappedLabel();
			oSnappedLabel.attachBrowserEvent("click", this.onToggleHeader, this);
			this.getPageTitle().addSnappedContent(oSnappedLabel);
		},

		removeSnappedLabel: function() {
			this.getPageTitle().destroySnappedContent();
		},

		getFilters: function(aCurrentFilterValues) {
			this.aFilters = [];

			this.aFilters = this.aKeys.map(function(sCriteria, i) {
				return new sap.ui.model.Filter(sCriteria, sap.ui.model.FilterOperator.Contains, aCurrentFilterValues[i]);
			});

			return this.aFilters;
		},
		getFilterCriteria: function(aCurrentFilterValues) {
			return this.aKeys.filter(function(el, i) {
				if (aCurrentFilterValues[i] !== "") return el;
			});
		},
		getFormattedSummaryText: function(aFilterCriterias) {
			if (aFilterCriterias.length > 0) {
				return "Filtered By (" + aFilterCriterias.length + "): " + aFilterCriterias.join(", ");
			} else {
				return "Filtered by None";
			}
		},

		getTable: function() {
			return this.getView().byId("idProductsTable");
		},
		getTableItems: function() {
			return this.getTable().getBinding("items");
		},
		getSelect: function(sId) {
			return this.getView().byId(sId);
		},
		getSelectedItemText: function(oSelect) {
			return oSelect.getSelectedItem() ? oSelect.getSelectedItem().getKey() : "";
		},
		getPage: function() {
			return this.getView().byId("dynamicPageId");
		},
		getPageTitle: function() {
			return this.getPage().getTitle();
		},
		getSnappedLabel: function() {
			return new sap.m.Label({
				text: "{/Filter/text}"
			});
		},
			getSplitAppObj: function() {
			var result = this.byId("SplitContainer");
			if (!result) {
				jQuery.sap.log.info("SplitApp object can't be found");
			}
			return result;
		},
	
		
	/*	onDashboardButtonPress: function(oEvent) {
			var SplitContainer = this.byId("SplitContainer");
			SplitContainer.to(this.createId("DashboardDetailpage"));
			
		}*/
		onListItemPress : function(oEvent) {
			var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();

			this.getSplitAppObj().toDetail(this.createId(sToPageId));
		},
		
		onSubmit: function () {
			this.getView().getModel().submitChanges();
		}

	
		

	});

});