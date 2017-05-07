var containerNode = document.querySelector('.content'),
	searchNode = document.querySelector('.search')

//--------------------------------------------
//    ***************VIEWS***************    
//--------------------------------------------
var HomeView = Backbone.View.extend({
	initialize : function() {
		containerNode.innerHTML = '<img src="images/default.gif"/>'
		this.listenTo(this.collection, 'sync', this._render)
	},
	_render : function() {
		var html = ''
		this.collection.forEach(function(inputModel) {
			// console.log(inputModel)
			html += '<div class="home-img">'
			html += 	'<a class="home-link" href="#details/' + inputModel.get('listing_id') + '">'
			html += 		'<img src="' + inputModel.get('MainImage').url_170x135 + '"/>'
			html += 		'<p>' + inputModel.get('title') + '</p>'
			html += 	'</a>'
			html += '</div>' 
		})
		containerNode.innerHTML = html
	}
})

var DetailsView = Backbone.View.extend({
	initialize : function() {
		containerNode.innerHTML = '<img src="images/default.gif"/>'
		this.listenTo(this.model, 'sync', this._render)
	},
	_render : function() {
		console.log(this.model)
		var html = ''
		var dataObj = this.model.models[0]
		// console.log(dataObj)
		html += '<div class="detail-img">'
		html += 	'<h1>' + dataObj.get('title') + '</h1>'
		html += 	'<img src="' + dataObj.get('MainImage').url_570xN + '"/>'
		html += 	'<h2>$' + dataObj.get('price') + '</h2>'
		html += 	'<p>Quantity: ' + dataObj.get('quantity') + '</p>'
 		html += 	'<h3>' + dataObj.get('description') + '</h3>'
 		html += 	'<a href="#details/" class="gallery previous">Previous Item</a>'
 		html += 	'<a href="#details/" class="gallery next">Next Item</a>'
		html += '</div>' 
		containerNode.innerHTML = html
	}
})

searchNode.addEventListener('keydown', function(eventObj) {
	if (eventObj.keyCode === 13) {
		var input = eventObj.target.value
		location.hash = 'search/' + input
		eventObj.target.value = ''
	}
})

//--------------------------------------------
//    ***************MODELS***************
//--------------------------------------------
var ItemsCollection = Backbone.Collection.extend({
	url: "https://openapi.etsy.com/v2/listings/active.js",
	parse: function(apiResponse) {
		return apiResponse.results
	}
})

var ItemModel = Backbone.Model.extend({
	url: "https://openapi.etsy.com/v2/listings/",
	parse: function(apiResponse) {
		console.log(apiResponse)
		return apiResponse.results[0]
	}
})

//--------------------------------------------
//  ***************CONTROLLER***************
//--------------------------------------------
var Controller = Backbone.Router.extend({
	routes : {
		"home" : "showHomePage",
		"search/:query" : "showSearch",
		"details/:id" : "showDetails",
		"*default" : "redirectToHome"
	},
	showHomePage : function() {
		var etsyModel = new ItemsCollection()
		etsyModel.fetch({
			dataType : 'jsonp',
			data : {
				includes : 'MainImage,Shop',
     			'api_key': 'dkupa76wtz5rphr5h9i9h09v'
			}
		})
		var homePage = new HomeView({
			collection : etsyModel
		})
	},
	showSearch : function(query) {
		var searchModel = new ItemsCollection()
		searchModel.fetch({
			dataType : 'jsonp',
			data : {
				includes : 'MainImage,Shop',
     			'api_key': 'dkupa76wtz5rphr5h9i9h09v',
     			keywords : query
			}
		})
		var searchPage = new HomeView({
			collection : searchModel
		})
	},
	showDetails : function(id) {
		console.log(id)
		var oneModel = new ItemModel()
		oneModel.url += id + '.js'
		oneModel.fetch({
			dataType : 'jsonp',
			data : {
				includes : 'MainImage,Shop',
				'api_key': 'dkupa76wtz5rphr5h9i9h09v'
			}
		})
		new DetailsView({
			model : oneModel
		})
	},
	redirectToHome : function() {
		location.hash = 'home'
	}
})

var newController = new Controller();
Backbone.history.start()