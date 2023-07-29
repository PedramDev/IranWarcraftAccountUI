import { AppRegionService } from './region.service'
import { AppProductCategoryService } from './product-category.service'
import { AppProductService} from './product.service'
import { AppModalService } from './modal.service'
import { AppUserService } from './user.service'
import { AppToasterService } from './toaster.service'


import { NzMessageService } from 'ng-zorro-antd/message'

import {AppBankAccountService} from './bank-account.service'
import {AppTagService} from './tag.service'
import {AppCommentService} from './comment.service'
import {AppArticleService} from './article.service'
import {AppArticleCategoryService} from './article-category.service'
import {AppMediaService} from './media.service'
import {AuthService } from './auth.service'
import { DataSharingService } from './data-sharing.service'

import {AppTicketService } from './ticket.service'
import {AppLicenseService } from './license.service'
import {AppLicenseGroupService } from './licensegroup.service'

import {AppSystemSettingService } from './system-setting.service'
import {AppAdditionalPageService } from './additional-page.service'
import {AppContactMessageService } from './contact-message.service'

import {AppTempFileService } from './temp.service'


const thirdPartyServices = [
    NzMessageService
]

export const services = [
    ...thirdPartyServices,
    AppToasterService,
    AppRegionService,
    AppProductService,
    AppProductCategoryService,
    AppUserService,
    AppModalService,

    AuthService,
    AppTempFileService,

    DataSharingService,
    AppSystemSettingService,
    AppAdditionalPageService,
    AppContactMessageService,


    AppLicenseGroupService,
    AppLicenseService,
    AppTicketService,
    AppTagService,
    AppCommentService,
    AppArticleService,
    AppArticleCategoryService,
    AppMediaService,
    AppBankAccountService
];