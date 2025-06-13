import uuid
from django.db import models
from django.utils import timezone as django_tz


class CmsBaseModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    created_at = models.DateTimeField(default=django_tz.now, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)

    class Meta:
        abstract = True

    def delete(self, **kwargs):
        self.before_delete()
        super(CmsBaseModel, self).delete()
        self.after_delete()

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        return

    def before_delete(self):
        pass

    def after_delete(self):
        pass


class CmsCntTrunkId(CmsBaseModel):
    """
    trunk content ID for branches; each content branch MUST refer to some trunk ID/item
    At every TrunkID MAX. ONE BRANCH MAY BE ADDED, in various language versions
    """

    class VISIBILITY(models.IntegerChoices):
        AUTHOR = 1
        LOGGED_IN_USERS = 2
        EVERYONE = 3

    visible_for = models.IntegerField(null=False, choices=VISIBILITY, default=VISIBILITY.EVERYONE)
    joined_branch_model_id = models.CharField(null=False, max_length=255)

    # joins for particular content branches (types) - it must be somehow DYNAMIC, allowing this class to be
    # extended when new content types are being added and (probably) shrinked when (and if) they are removed.
    # for one trunk_id there may be ONLY ONE CONTENT TYPE in all languages - nothing more


    # published_at = models.DateTimeField(auto_now=True, db_index=True)
    # main_category = models.CharField(null=True, max_length=500)
    # all_categories = models.CharField(null=True, max_length=2500)
    

class CmsCntBranchTop(CmsBaseModel):
    """"
    ** abstract top class for content branches **
    """
    trunk = models.ForeignKey("CmsCntTrunkId", on_delete=models.DO_NOTHING)
    lang = models.CharField(null=False, max_length=10)
    published_at = models.DateTimeField(auto_now=True, db_index=True)
    is_visible = models.BooleanField(default=False)
    category = models.CharField(null=True, max_length=500)

    _branch_model_id = None

    def get_branch_model_id(self):
        return self._branch_model_id

    class Meta:
        abstract = True


class CmsCntBlogPost(CmsCntBranchTop):
    _branch_model_id = 'blog_post'
    title = models.CharField(null=False)
    body = models.TextField(null=True)


class CmsCntNewsPost(CmsCntBranchTop):
    _branch_model_id = 'news_post'
    title = models.CharField(null=False)
    body = models.TextField(null=True)
    news_source = models.CharField(null=False)


class CmsCntBook(CmsCntBranchTop):
    _branch_model_id = 'book'
    title = models.CharField(null=False)
    authors = models.TextField(null=False)
    genre = models.CharField(null=False)
    pub_year = models.CharField(null=True)
    isbn = models.CharField(null=True)
    desc = models.TextField(null=True)




class ContentService:
    def __init__(self):
        pass

    