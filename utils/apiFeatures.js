
class APIFeatures {
    constructor(mongoseQuery, query) {
        this.mongoseQuery = mongoseQuery;
        this.query = query;
    }


    filter() {
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        const queryStrObj = { ...this.query }
        const ignoreQuries = ['page', 'limit', 'sort', 'fields', 'keyword']
        ignoreQuries.forEach((value) => delete queryStrObj[value])
        //Filtration Add $ to query string
        let queryStr = JSON.stringify(queryStrObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (value) => `$${value}`)

        this.mongoseQuery.find(JSON.parse(queryStr));
        return this
    }

    pagination(docsCount) {
        const page = this.query.page * 1 || 1;
        const limit = this.query.limit * 1 || 10;
        const skip = (page - 1) * limit;
        const endIndex = page * limit

        const pagination = {}

        pagination.currentPage = page;
        pagination.limit = limit;
        pagination.skip = skip;
        pagination.totalPages = Math.ceil(docsCount / limit);
        pagination.totalItems = docsCount;
        if (page > 1) {
            pagination.previousPage = page - 1;
        }
        if (endIndex < pagination.totalItems) {
            pagination.nextPage = page + 1;
        }

        this.pagination = pagination;
        this.mongoseQuery.limit(limit).skip(skip);
        return this;
    }


    sort() {
        if (this.query.sort) {
            const sortQuery = this.query.sort.split(',').join(' ').trim()
            this.mongoseQuery = this.mongoseQuery.sort(sortQuery);
        } else {
            this.mongoseQuery = this.mongoseQuery.sort("-createdAt")
        }
        return this
    }

    limitFields() {
        if (this.query.fields) {
            const sortQuery = this.query.fields.split(',').join(' ').trim()
            this.mongoseQuery = this.mongoseQuery.select(sortQuery);
        } else {
            this.mongoseQuery = this.mongoseQuery.select("-__v")
        }
        return this
    }


    search(ModelName) {
        if (this.query.keyword) {
            let query = {};
            if (ModelName === 'Products') {
                query.$or = [
                    { title: { $regex: this.query.keyword, $options: "i" } },
                    { description: { $regex: this.query.keyword, $options: "i" } }
                ]
            } else {
                query = { name: { $regex: this.query.keyword, $options: "i" } };
            }


            this.mongoseQuery = this.mongoseQuery.find(query);
        }
        return this
    }
}

module.exports = APIFeatures