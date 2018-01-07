import BaseController from "../BaseController";

import swal from "sweetalert";

export default class NewSellingController extends BaseController {
  constructor($scope, $timeout, $state, DbService) {
    super($scope, $timeout);

    const productCollection = DbService.getCollection("products");

    $scope.searchTerm = null;
    $scope.suggestionItems = [];

    $scope.selling = {
      customerCpf: null,
      items: [],
      totalPrice: 0
    };

    $scope.search = () => {
      if (!$scope.searchTerm || $scope.searchTerm.length < 3) {
        $scope.suggestionItems = [];
        return;
      }

      productCollection
        .find({
          $or: [
            { code: new RegExp($scope.searchTerm, "i") },
            { name: new RegExp($scope.searchTerm, "i") }
          ]
        })
        .exec((err, products) => {
          $timeout(() => {
            $scope.suggestionItems = products;
          }, 0);
        });
    };

    $scope.add = product => {
      $scope.selling.items.push({
        productId: product._id,
        code: product.code,
        name: product.name,
        price: product.price,
        discount: 0,
        quantity: 1,
        totalPrice: product.price
      });

      $scope.updatePrices();
    };

    $scope.delete = index => {
      $scope.selling.items.splice(index, 1);
      $scope.updatePrices();
    };

    $scope.updatePrices = () => {
      let totalPrice = 0;

      $scope.selling.items.forEach(item => {
        if (item.discount < 0) {
          item.discount = 0;
        }

        if (item.discount > 100) {
          item.discount = 100;
        }

        if (item.quantity < 1) {
          item.quantity = 1;
        }

        item.totalPrice =
          (item.price - item.price * item.discount / 100) * item.quantity;
        totalPrice += item.totalPrice;
      });

      $scope.selling.totalPrice = totalPrice;
    };

    $scope.confirm = () => {
      const collection = DbService.getCollection("sellings");

      $scope.selling.created_on = new Date();

      collection.insert($scope.selling, err => {
        if (err) {
          swal({
            title: "Erro!",
            text: "Ocorreu um erro.",
            icon: "error"
          });
        } else {
          swal({
            title: "Sucesso!",
            text: "Registro salvo com sucesso!",
            icon: "success"
          }).then(() => {
            $state.go("home");
          });
        }
      });
    };
  }
}
