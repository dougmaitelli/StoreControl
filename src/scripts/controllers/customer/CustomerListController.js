import ListController from "../ListController";

export default class CustomerListController extends ListController {
  constructor($scope, $timeout, DbService) {
    super($scope, $timeout, DbService.getCollection("customers"));
  }
}
