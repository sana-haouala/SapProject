sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/Filter',
	'sap/ui/model/json/JSONModel',
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/m/Label',
	'sap/m/MessageToast',
	'sap/m/Text',
	'sap/m/TextArea'
], function(jQuery, Controller, Filter, JSONModel, Button, Dialog, Label, MessageToast, Text, TextArea) {
	"use strict";

	return Controller.extend("nextgen.nextgen.controller.ControlManager", {

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
		onSelectionGrid: function() {

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
		},
		onSubmitDialog: function() {
				var dialog = new Dialog({
				title: 'Success',
				type: 'Message',
				state: 'Success',
				content: new Text({
					text: 'The request is accepted successfully.'
				}),
				beginButton: new Button({
					text: 'OK',
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});

			dialog.open();
		},

		onRejectDialog: function() {
			var dialog = new Dialog({
				title: 'Confirm',
				type: 'Message',
				content: [
					new Label({
						text: 'Are you sure you want to reject this request? Add some comments to explain the rejection',
						labelFor: 'submitDialogTextarea'
					}),
					new TextArea('submitDialogTextarea', {
						liveChange: function(oEvent) {
							var sText = oEvent.getParameter('value');
							var parent = oEvent.getSource().getParent();

							parent.getBeginButton().setEnabled(sText.length > 0);
						},
						width: '100%',
						placeholder: 'Add note (required)'
					})
				],
				beginButton: new Button({
					text: 'Submit',
					enabled: false,
					press: function() {
						var sText = sap.ui.getCore().byId('submitDialogTextarea').getValue();
						MessageToast.show('Note is: ' + sText);
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