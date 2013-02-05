class User < ActiveRecord::Base
	belongs_to :role
	
	
  # Include default devise modules. Others available are:
  # :token_authenticatable, :encryptable, :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :encryptable, :confirmable, :lockable,
         :recoverable, :trackable, :validatable, :authentication_keys => [:login]

  # Setup accessible (or protected) attributes for your model
  attr_accessible :username, :email, :password, :password_confirmation, :remember_me 
  # attr_accessible :title, :body
	
	validates :username, presence: true, uniqueness: { case_sensitive: false }
  
  attr_accessor :login
  attr_accessible :login
	
	
  before_create :set_default_role
	
	
	
	before_save { |user| user.username = username.downcase }
  
  def self.find_first_by_auth_conditions(warden_conditions)
	  conditions = warden_conditions.dup
	  if login = conditions.delete(:login)
		where(conditions).where(["lower(username) = :value OR lower(email) = :value", { :value => login.downcase }]).first
	  else
		where(conditions).first
	  end
	end
	
  def set_default_role
    self.role ||= Role.find_by_name('registered')
  end
	
end
