import ListController from '../ListController'

export default class ProductListController extends ListController {

  constructor($scope, $timeout, DbService) {
    super($scope, $timeout, DbService.getCollection('products'))
  }
}
