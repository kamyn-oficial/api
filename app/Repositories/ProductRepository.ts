import ProductModel from 'App/Models/ProductModel'
import CategoryModel from 'App/Models/CategoryModel'
import CommentModel from 'App/Models/CommentModel'
import UserModel from 'App/Models/UserModel'
import SizeModel from 'App/Models/SizeModel'
import type { ProductSchema } from 'App/Types'

class ProductRepository {
  public create(schema: ProductSchema) {
    return new ProductModel(schema).save()
  }

  public readonly selectFields = [
    '_id',
    'name',
    'price',
    'promotion',
    'description',
    'quantity',
    'categories',
    'photos',
    'colors',
    'sizes',
    'createdAt'
  ]

  public async getAll(current_page = 1, per_page = 15, filter: any) {
    const skip = (current_page - 1) * per_page

    let [data, total] = await Promise.all([
      ProductModel.find({
        ...(filter.categories && {
          categories: { $in: filter.categories.split(',') }
        }),
        ...(filter.sizes && {
          sizes: { $in: filter.sizes.split(',') }
        }),
        ...(filter.price && {
          price: {
            $gte: filter.price.split(',')[0],
            $lte: filter.price.split(',')[1]
          }
        }),
        ...(filter.name && {
          name: { $regex: filter.name, $options: 'i' }
        })
      })
        .select(this.selectFields)
        .skip(skip)
        .limit(per_page)
        .populate({ path: 'sizes', model: SizeModel })
        .populate({ path: 'categories', model: CategoryModel })
        .populate({ path: 'comments', model: CommentModel }),
      ProductModel.countDocuments()
    ])

    data = data.map((item: any) => {
      return {
        ...item._doc,
        rating:
          item.comments.length > 0
            ? item.comments.reduce((a: any, b: any) => a + b.rate, 0) /
            item.comments.length
            : 0
      }
    })

    return {
      data,
      current_page,
      per_page,
      total
    }
  }

  public async findById(id: string) {
    const data: any = await ProductModel.findById(id)
      .populate({ path: 'sizes', model: SizeModel })
      .populate({ path: 'categories', model: CategoryModel })
      .populate({
        path: 'comments',
        model: CommentModel,
        populate: {
          path: 'user',
          model: UserModel
        }
      })

    let rating = 0

    if (data) {
      rating =
        data.comments.length > 0
          ? data.comments.reduce((a: any, b: any) => a + b.rate, 0) /
          data.comments.length
          : 0
    }

    return {
      ...data?._doc,
      rating
    }
  }

  public async addComment(productId: string, commentId: string) {
    const data: any = await ProductModel.findById(productId).populate({
      path: 'comments',
      model: CommentModel
    })
    data.comments.push(commentId)
    return data.save()
  }

  public updateById(id: string, data: Partial<ProductSchema>) {
    return ProductModel.findByIdAndUpdate(id, data)
  }

  public deleteById(id: string) {
    return ProductModel.findByIdAndDelete(id)
  }

  public random(limit: number) {
    return ProductModel.aggregate([
      { $sample: { size: limit } },
      {
        $lookup: {
          from: 'categories',
          localField: 'categories',
          foreignField: '_id',
          as: 'categories'
        }
      },
      {
        $lookup: {
          from: 'sizes',
          localField: 'sizes',
          foreignField: '_id',
          as: 'sizes'
        }
      },
      {
        $lookup: {
          from: 'comments',
          localField: 'comments',
          foreignField: '_id',
          as: 'comments'
        }
      }
    ])
  }
}

export default new ProductRepository()
