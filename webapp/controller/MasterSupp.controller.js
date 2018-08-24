sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/Filter',
	'sap/ui/model/json/JSONModel'
], function(jQuery, Controller, Filter, JSONModel) {
	"use strict";

	return Controller.extend("nextgen.nextgen.controller.MasterSupp", {

		// navigation 2 methods
		/*	getSplitAppObj: function() {
				var result = this.byId("SplitContainer");
				if (!result) {
					jQuery.sap.log.info("SplitApp object can't be found");
				}
				return result;
			}, 

			onListItemPress: function(oEvent) {
				var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();

				this.getSplitAppObj().toDetail(this.createId(sToPageId));

			},*/
		//supplier
		onInit: function() {
				this.oModel = new JSONModel();
			this.oModel.loadData("model/Requests.json");
			this.getView().setModel(this.oModel);

			this.aKeys = ["Date", "Category", "Priority"];
			this.oSelectName = this.getSelect("slDate");
			this.oSelectCategory = this.getSelect("slCategory");
			this.oSelectPriority = this.getSelect("slPriority");
		this.oModel.setProperty("/Filter/text", "Filtered by None");

		},
		onSelectionGrid: function(){
			
				this.oModel = new JSONModel();
			this.oModel.loadData("model/Person.json");
			this.getView().setModel(this.oModel);
			
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
			
			//this.getPageTitle().addSnappedContent(oSnappedLabel);
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

		onListItemPress: function(oEvent) {
			var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();

			this.getSplitAppObj().toDetail(this.createId(sToPageId));
		}
		
	 
	});

});