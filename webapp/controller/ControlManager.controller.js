sap.ui.define([
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/m/Text',
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/Filter',
	'sap/ui/model/json/JSONModel'
], function(Button, Dialog, Text,jQuery, Controller, Filter, JSONModel) {
	"use strict";

	return Controller.extend("nextgen.nextgen.controller.ControlManager", {

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

		onDashboardButtonPress: function(oEvent) {
			var SplitContainer = this.byId("SplitContainer");
			SplitContainer.to(this.createId("DashboardDetailpage"));

		},

		onMessageWarningDialogPress: function(oEvent) {
			var dialog = new Dialog({
				title: 'Warning',
				type: 'Message',
				state: 'Warning',
				content: new Text({
					text: 'Ruling the world is a time-consuming task. You will not have a lot of spare time.'
				}),
				beginButton: new Button({
					text: 'OK',
					press: function() {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});

			dialog.open();
		},

		onMessageSuccessDialogPress: function(oEvent) {
			var dialog = new Dialog({
				title: 'Success',
				type: 'Message',
				state: 'Success',
				content: new Text({
					text: 'One of the keys to success is creating realistic goals that can be achieved in a reasonable amount of time.'
				}),
				beginButton: new Button({
					text: 'Submit',
					press: function() {
						MessageToast.show('Submit pressed!');
						dialog.close();
					}
				}),
				endButton: new Button({
					text: 'Cancel',
					press: function() {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});

			dialog.open();
		}

	});

});